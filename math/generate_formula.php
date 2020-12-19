<?php
    include_once("common.php");

    define("ADD", 1);
    define("SUB", 2);
    define("MUL", 4);
    define("DIV", 8);

    $opr_arr = array(ADD=>"+", SUB=>"-", MUL=>"*", DIV=>"/");

    $range = get_browser_param("range", 10);
    $non_negative = get_browser_param("nonnegative", 1); // 结果非负
    $is_carry = get_browser_param("carry", 0); // 进退位
    $operator = get_browser_param("operator", 1); // 运算符

    $list = array();
    // 生成公式
    for ($i=0; $i < $range; $i++) { 
        for ($j=0; $j < $range; $j++) { 
            foreach($opr_arr as $opr => $opr_name)
            {
                if(($operator & $opr) > 0)
                {
                    $formula = "$i$opr_name$j"; 
                    $result = eval("return $formula;");
                    if($result>=$range)
                        continue;
                    if($non_negative && $result < 0)
                        continue;
                    if(!$is_carry)
                    {
                        $opr1 = str_split($i);
                        $opr2 = str_split($j);
                        if(count($opr1)!=count($opr2))
                        {
                            $arr = array_fill(0,abs(count($opr1)-count($opr2)),"0");
                            if(count($opr1)>count($opr2))
                            {
                                $opr2 = array_merge($arr, $opr2);
                            }
                            else if(count($opr1)<count($opr2))
                            {
                                $opr1 = array_merge($arr, $opr1);
                            }
                        }
                        $b = false;
                        for ($k=0; $k < count($opr1); $k++) { 
                            $f = "$opr1[$k] $opr_name $opr2[$k]";
                            $r = eval("return $f;");
                            if($r < 0 || $r > 9)
                            {
                                $b = true;
                                break;
                            }
                        }
                        if($b)
                            continue;
                    }
                    $list[] = $formula;
                }
            }
        }
    }
    echo json_encode($list);
?>