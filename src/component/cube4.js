
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,viewport-fit=cover">
    <title>第五步：自动还原魔方</title>
    <script type="text/javascript" src="./lib/three.js"></script>
    <script type="text/javascript" src="./lib/three-orbit-controls.js"></script>
    <style type="text/css">
        body{
            margin:0;
            padding:0;
        }
        div#canvas-frame {
            cursor: pointer;
            width:100%;
            height:100%;
            background-color: #EEEEEE;
        }
        .btn-list{
            list-style-type:none;
            margin:0;
            padding:0;
            position: fixed;
            top:0;
            left:0;
        }
        button{
            font-size:20px;
            margin:5px 0 0 5px;
            border:1px solid #d1d1d1;
            background-color:#fff;
        }
        p{
            color:#ff0000;
            margin: 5px 0 0 5px;
        }
    </style>
</head>
<body onload="threeStart();">
    <ul class="btn-list">
        <li><button id="autoResetV1">自动还原</button></li>
        <li><button id="randomRotate">随机旋转</button></li>
        <li><p class="error"></p></li>
    </ul>
    <div id="canvas-frame"></div>
    <script src="//cdn.bootcss.com/eruda/1.4.2/eruda.min.js"></script>
    <script>eruda.init();</script>
    <script>
        var renderer;//渲染器
        var width;//页面宽度
        var height;//页面高度
        var raycaster = new THREE.Raycaster();//光线碰撞检测器
        var mouse = new THREE.Vector2();//存储鼠标坐标或者触摸坐标
        var isRotating = false;//魔方是否正在转动
        var intersect;//碰撞光线穿过的元素
        var normalize;//触发平面法向量
        var startPoint;//触发点
        var movePoint;
        var minCubeIndex;
        var initStatus = [];//魔方初始状态
        var startFaceNo = 0;
        var currentFaceNo = 0;
        var endFaceNo = 3;
        //魔方转动的六个方向
        const XLine = new THREE.Vector3( 1, 0, 0 );//X轴正方向
        const XLineAd = new THREE.Vector3( -1, 0, 0 );//X轴负方向
        const YLine = new THREE.Vector3( 0, 1, 0 );//Y轴正方向
        const YLineAd = new THREE.Vector3( 0, -1, 0 );//Y轴负方向
        const ZLine = new THREE.Vector3( 0, 0, 1 );//Z轴正方向
        const ZLineAd = new THREE.Vector3( 0, 0, -1 );//Z轴负方向
        const CubeParams = {//魔方参数
            x:-75,
            y:75,
            z:75,
            num:3,
            len:50,
            //[右,左,上,下,前,后]
            colors:['yellow','red','blue','green','white','pink']
        };
        //随机旋转，用于打乱魔方
        function randomRotate(){
            if(!isRotating&&!isAutoReset){
                var stepNum = parseInt(20*Math.random())+1;//保证至少转动一步
                //var stepNum = 0;
                console.log('random rotate '+stepNum);
                var funcArr = [R,U,F,B,L,D,r,u,f,b,l,d];
                var stepArr = [];
                for(var i=0;i<stepNum;i++){
                    var num = parseInt(Math.random()*funcArr.length);
                    stepArr.push(funcArr[num]);
                }
                runMethodAtNo(stepArr,0,0);
            }
        }
        
        //自动还原第一版
        var isAutoReset = false;
        var currentStep = 1;
        var bottomColor;
        var topColor;
        var startTime = 0;;
        var endTime = 0;
        var stepCount = 0;
        function autoResetV1(cubes){
            if(!checkStep8()&&!isRotating){
                console.log('start autoResetV1');
                startTime = window.performance.now();
                console.log('start at:'+startTime);
                stepCount = 0;
                isAutoReset = true;
                var topCenter = getCubeByIndex(10);//获取上表面中心小方块
                topColor = getFaceColorByVector(topCenter,YLine);//获取上表面颜色
                bottomColor = getOppositeColor(topColor);//获取上表面颜色对应色
                if(checkStep7()){
                    currentStep = 8;
                    console.log('start step8');
                    step8();
                }else if(checkStep6()){
                    currentStep = 7;
                    console.log('start step7');
                    step7();
                }else if(checkStep5()){
                    currentStep = 6;
                    console.log('start step6');
                    step6();
                }else if(checkStep4()){
                    currentStep = 5;
                    console.log('start step5');
                    step5();
                }else if(checkStep3()){
                    currentStep = 4;
                    startFaceNo = 0;
                    currentFaceNo = 0;
                    endFaceNo = 3;
                    console.log('start step4');
                    step4();
                }else if(checkStep2()){
                    currentStep = 3;
                    console.log('start step3');
                    step3();
                }else if(checkStep1()){
                    currentStep = 2;
                    console.log('start step2');
                    step2();
                }else{
                    currentStep = 1;
                    console.log('start step1');
                    step1();
                }
            }else{
                console.log('already reset');
            }
        }
        //第八步 顶角归位
        function step8(){
            if(checkStep8()){
                isAutoReset = false;
                endTime = window.performance.now();
                console.log('end at:'+endTime);
                console.log('total times:'+(endTime-startTime));
                console.log('total steps:'+stepCount);
                console.log('end autoResetV1');
                return;
            }
            step8Case1(0);
            step8Case1(1);
            step8Case1(2);
            step8Case1(3);
            step8Case2(0);
            step8Case2(1);
            step8Case2(2);
            step8Case2(3);
            step8Case3();
            if(!isRotating){
                isAutoReset = false;
                console.log('something wrong in step8');
            }
        }
        //判断顶角归位 是否完成
        function checkStep8Item(indexs,line){
            if(indexs.length>0){
                var arr = getCubeByIndexs(indexs);
                var color = getFaceColorByVector(arr[0],line)
                for(var i=1;i<arr.length;i++){
                    if(getFaceColorByVector(arr[i],line)!=color){
                        return false;
                    }
                }
            }
            return true;
        }
        function checkStep8(){
            var result = true;
            var indexs1 = [1,0,2,3,4,5,6,7,8];
            result = checkStep8Item(indexs1,ZLine);
            if(!result){
                return result;
            }
            var indexs2 = [11,14,17,20,23,26,2,5,8]
            result = checkStep8Item(indexs2,XLine);
            if(!result){
                return result;
            }
            var indexs3 = [19,18,21,22,24,25,20,23,26];
            result = checkStep8Item(indexs3,ZLineAd);
            if(!result){
                return result;
            }
            var index4 = [9,0,3,6,12,15,18,21,24];
            result = checkStep8Item(index4,XLineAd);
            if(!result){
                return result;
            }
            return result;
        }
        function rotate801(rotateNum){
            //RRBBRFrBBRfR
            var arr = [R,R,B,B,R,F,r,B,B,R,f,R];
            runMethodAtNo(arr,0,rotateNum);
        }
        function rotate802(rotateNum){
            //LLBBlfLBBlFl
            var arr = [L,L,B,B,l,f,L,B,B,l,F,l];
            runMethodAtNo(arr,0,rotateNum);
        }
        //顶角归位 第一种情况
        function step8Case1(rotateNum){
            if(!isRotating){
                var cube2 = getCubeByIndex(2,rotateNum);
                var cube20 = getCubeByIndex(20,rotateNum);
                var cube11 = getCubeByIndex(11,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                if(getFaceColorByVector(cube2,xLine)==getFaceColorByVector(cube20,xLine)&&
                    getFaceColorByVector(cube2,xLine)!=getFaceColorByVector(cube11,xLine)){
                    rotate801(rotateNum);
                }
            }
        }
        //顶角归位 第二种情况
        function step8Case2(rotateNum){
            if(!isRotating){
                var cube0 = getCubeByIndex(0,rotateNum);
                var cube1 = getCubeByIndex(1,rotateNum);
                var cube2 = getCubeByIndex(2,rotateNum);
                var cube11 = getCubeByIndex(11,rotateNum);
                var cube20 = getCubeByIndex(20,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                if(getFaceColorByVector(cube0,zLine)==getFaceColorByVector(cube20,xLine)&&
                    getFaceColorByVector(cube1,zLine)==getFaceColorByVector(cube2,zLine)&&
                    getFaceColorByVector(cube11,xLine)==getFaceColorByVector(cube20,xLine)&&
                    getFaceColorByVector(cube0,zLine)!=getFaceColorByVector(cube1,zLine)&&
                    getFaceColorByVector(cube20,xLine)!=getFaceColorByVector(cube20,xLine)){
                    rotate802(rotateNum);
                }
            }
        }
        //顶角归位 第三种情况
        function step8Case3(){
            if(!isRotating){
                var cube0 = getCubeByIndex(0);
                var cube2 = getCubeByIndex(2);
                var cube20 = getCubeByIndex(20);
                var cube18 = getCubeByIndex(18);
                if(getFaceColorByVector(cube0,ZLine)!=getFaceColorByVector(cube2,ZLine)&&
                    getFaceColorByVector(cube2,XLine)!=getFaceColorByVector(cube20,XLine)&&
                    getFaceColorByVector(cube20,ZLineAd)!=getFaceColorByVector(cube18,ZLineAd)&&
                    getFaceColorByVector(cube18,XLineAd)!=getFaceColorByVector(cube0,XLineAd)){
                    rotate801(0);
                }
            }
        }
        //第七步 顶棱归位
        function step7(){
            if(checkStep7()){
                console.log('start step8');
                currentStep = 8;
                step8();
                return;
            }
            step7Case1(0);
            step7Case1(1);
            step7Case1(2);
            step7Case1(3);
            step7Case2(0);
            step7Case2(1);
            step7Case2(2);
            step7Case2(3);
            step7Case3();
            if(!isRotating){
                isAutoReset = false;
                console.log('something wrong in step7');
            }
        }
        //顶棱归位 第一种情况
        function step7Case1(rotateNum){
            if(!isRotating){
                var cube11 = getCubeByIndex(11,rotateNum);
                var cube4 = getCubeByIndex(4,rotateNum);
                var cube1 = getCubeByIndex(1,rotateNum);
                var cube14 = getCubeByIndex(14,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                var zLine4Color = getFaceColorByVector(cube4,zLine);
                if(getFaceColorByVector(cube1,zLine)!=zLine4Color&&
                    zLine4Color==getFaceColorByVector(cube11,xLine)&&
                    zLine4Color!=getFaceColorByVector(cube14,xLine)){
                    F(rotateNum,function(){
                        F(rotateNum,function(){
                            U(rotateNum,function(){
                                r(rotateNum,function(){
                                    L(rotateNum,function(){
                                        F(rotateNum,function(){
                                            F(rotateNum,function(){
                                                R(rotateNum,function(){
                                                    l(rotateNum,function(){
                                                        U(rotateNum,function(){
                                                            F(rotateNum,function(){
                                                                F(rotateNum)
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
            }
        }
        //顶棱归位 第二种情况
        function step7Case2(rotateNum){
            if(!isRotating){
                var cube1 = getCubeByIndex(1,rotateNum);
                var cube4 = getCubeByIndex(4,rotateNum);
                var cube11 = getCubeByIndex(11,rotateNum);
                var cube14 = getCubeByIndex(14,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                var zLine1Color = getFaceColorByVector(cube1,zLine);
                if(zLine1Color!=getFaceColorByVector(cube4,zLine)&&
                    zLine1Color==getFaceColorByVector(cube14,xLine)&&
                    zLine1Color!=getFaceColorByVector(cube11,xLine)){
                    F(rotateNum,function(){
                        F(rotateNum,function(){
                            u(rotateNum,function(){
                                r(rotateNum,function(){
                                    L(rotateNum,function(){
                                        F(rotateNum,function(){
                                            F(rotateNum,function(){
                                                R(rotateNum,function(){
                                                    l(rotateNum,function(){
                                                        u(rotateNum,function(){
                                                            F(rotateNum,function(){
                                                                F(rotateNum)
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
            }
        }
        //顶棱归位 第三种情况（有两个对应的面顶棱完成，另外两个对应的面顶棱没有）
        function step7Case3(){
            if(!isRotating&&!checkStep7()){
                u(0);
            }
        }
        //判断是否完成第七步 顶棱归位
        function checkStep7(){
            if(!checkStep6()){
                return false;
            }
            var cube1 = getCubeByIndex(1);
            var cube4 = getCubeByIndex(4);
            var cube11 = getCubeByIndex(11);
            var cube14 = getCubeByIndex(14);
            var cube19 = getCubeByIndex(19);
            var cube22 = getCubeByIndex(22);
            var cube9 = getCubeByIndex(9);
            var cube12 = getCubeByIndex(12);
            if(getFaceColorByVector(cube1,ZLine)!=getFaceColorByVector(cube4,ZLine)||
                getFaceColorByVector(cube11,XLine)!=getFaceColorByVector(cube14,XLine)||
                getFaceColorByVector(cube19,ZLineAd)!=getFaceColorByVector(cube22,ZLineAd)||
                getFaceColorByVector(cube9,XLineAd)!=getFaceColorByVector(cube12,XLineAd)){
                return false;
            }
            return true;
        }
        //第六步 顶角面位
        function step6(){
            if(checkStep6()){
                console.log('start step7');
                currentStep = 7;
                step7();
                return;
            }
            step6Case1(0);
            step6Case1(1);
            step6Case1(2);
            step6Case1(3);
            if(!isRotating){
                isAutoReset = false;
                console.log('something wrong in step6');
            }
        }
        function rotate601(rotateNum){
            //rULuRUlu
            var arr = [r,U,L,u,R,U,l,u];
            runMethodAtNo(arr,0,rotateNum);
        }
        function rotate602(rotateNum){
            //ULurUluR
            var arr = [U,L,u,r,U,l,u,R];
            runMethodAtNo(arr,0,rotateNum);
        }
        function rotate603(rotateNum){
            //RUrURUUr
            var arr = [R,U,r,U,R,U,U,r];
            runMethodAtNo(arr,0,rotateNum);
        }
        //顶角面位 第一种、第二种和第三种情况
        function step6Case1(rotateNum){
            if(!isRotating){
                var cube0 = getCubeByIndex(0,rotateNum);
                var cube2 = getCubeByIndex(2,rotateNum);
                var cube20 = getCubeByIndex(20,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                if(getFaceColorByVector(cube0,zLine)==topColor&&
                    getFaceColorByVector(cube2,xLine)==topColor){
                    rotate601(rotateNum);
                }else if(getFaceColorByVector(cube2,zLine)==topColor&&
                    getFaceColorByVector(cube20,xLine)==topColor){
                    rotate602(rotateNum);
                }else if(getFaceColorByVector(cube0,zLine)==topColor){
                    rotate603(rotateNum);
                }
            }
        }
        //判断是否完成第六步 顶角面位
        function checkStep6(){
            if(!checkStep5()){
                return false;
            }
            var cube0 = getCubeByIndex(0);
            var cube2 = getCubeByIndex(2);
            var cube18 = getCubeByIndex(18);
            var cube20 = getCubeByIndex(20);
            if(getFaceColorByVector(cube0,YLine)!=topColor||
                getFaceColorByVector(cube2,YLine)!=topColor||
                getFaceColorByVector(cube18,YLine)!=topColor||
                getFaceColorByVector(cube20,YLine)!=topColor){
                return false;
            }
            return true;
        }
        //第五步 顶棱面位
        function step5(){
            if(checkStep5()){
                console.log('start step6');
                currentStep = 6;
                step6();
                return;
            }
            step5Case1(0);
            step5Case1(1);
            step5Case1(2);
            step5Case1(3);
            step5Case2(0);
            step5Case2(1);
            step5Case2(2);
            step5Case2(3);
            step5Case3(0);
            step5Case3(1);
            step5Case3(2);
            step5Case3(3);
            if(!isRotating){
                isAutoReset = false;
                console.log('something wrong in step5');
            }
        }
        function rotate501(rotateNum,next){
            //rufUFR
            var arr = [r,u,f,U,F,R];
            runMethodAtNo(arr,0,rotateNum,next);
        }
        function rotate502(rotateNum,next){
            //rfuFUR
            var arr = [r,f,u,F,U,R];
            runMethodAtNo(arr,0,rotateNum,next);
        }
        //顶棱面位 第一种情况
        function step5Case1(rotateNum){
            if(!isRotating){
                var cube1 = getCubeByIndex(1,rotateNum);
                var cube11 = getCubeByIndex(11,rotateNum);
                var cube9 = getCubeByIndex(9,rotateNum);
                var cube19 = getCubeByIndex(19,rotateNum);
                var cube10 = getCubeByIndex(10,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                if(getFaceColorByVector(cube10,YLine)==topColor&&
                    getFaceColorByVector(cube9,YLine)==topColor&&
                    getFaceColorByVector(cube19,YLine)==topColor&&
                    getFaceColorByVector(cube1,zLine)==topColor&&
                    getFaceColorByVector(cube11,xLine)==topColor){
                    rotate501(rotateNum);
                }
            }
        }
        //顶棱面位 第二种情况
        function step5Case2(rotateNum){
            if(!isRotating){
                var cube1 = getCubeByIndex(1,rotateNum);
                var cube11 = getCubeByIndex(11,rotateNum);
                var cube19 = getCubeByIndex(19,rotateNum);
                var cube10 = getCubeByIndex(10,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                if(getFaceColorByVector(cube10,YLine)==topColor&&
                    getFaceColorByVector(cube1,YLine)==topColor&&
                    getFaceColorByVector(cube19,YLine)==topColor&&
                    getFaceColorByVector(cube11,xLine)==topColor){
                    rotate501(rotateNum);
                }
            }
        }
        //顶棱面位 第三种情况
        function step5Case3(rotateNum){
            if(!isRotating){
                var cube1 = getCubeByIndex(1,rotateNum);
                var cube11 = getCubeByIndex(11,rotateNum);
                var cube10 = getCubeByIndex(10,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                if(getFaceColorByVector(cube10,YLine)==topColor&&
                    getFaceColorByVector(cube1,zLine)==topColor&&
                    getFaceColorByVector(cube11,xLine)==topColor){
                    rotate501(rotateNum,function(){
                        U(rotateNum,function(){
                            rotate502(rotateNum);
                        })
                    });
                }
            }
        }
        //判断是否完成第五步 顶棱面位
        function checkStep5(){
            if(!checkStep4()){
                return false;
            }
            var cube1 = getCubeByIndex(1);
            var cube11 = getCubeByIndex(11);
            var cube9 = getCubeByIndex(9);
            var cube19 = getCubeByIndex(19);
            var cube10 = getCubeByIndex(10);
            if(getFaceColorByVector(cube10,YLine)!=topColor||
                getFaceColorByVector(cube1,YLine)!=topColor||
                getFaceColorByVector(cube11,YLine)!=topColor||
                getFaceColorByVector(cube9,YLine)!=topColor||
                getFaceColorByVector(cube19,YLine)!=topColor){
                return false;
            }
            return true;
        }
        //第四步 中棱归位
        function step4(){
            if(checkStep4()){
                console.log('start step5');
                currentStep = 5;
                step5();
                return;
            }
            
            step4Face(currentFaceNo);
            if(!isRotating){
                isAutoReset = false;
                console.log('something wrong in step4');
            }
        }
        function rotate401(rotateNum,next){
            if(rotateNum<0){
                rotateNum = 4-Math.abs(rotateNum);
            }
            //rururURUR
            var arr = [r,u,r,u,r,U,R,U,R];
            runMethodAtNo(arr,0,rotateNum,next);
        }
        function rotate401Opposite(rotateNum,next){
            if(rotateNum<0){
                rotateNum = 4-Math.abs(rotateNum);
            }
            //ruruRURUR
            var arr = [r,u,r,u,R,U,R,U,R];
            runMethodAtNo(arr,0,rotateNum,next);
        }
        function rotate402(rotateNum,next){
            if(rotateNum<0){
                rotateNum = 4-Math.abs(rotateNum);
            }
            //FUFUFufuf
            var arr = [F,U,F,U,F,u,f,u,f];
            runMethodAtNo(arr,0,rotateNum,next);
        }
        function rotate402Opposite(rotateNum,next){
            if(rotateNum<0){
                rotateNum = 4-Math.abs(rotateNum);
            }
            //FUFUfufuf
            var arr = [F,U,F,U,f,u,f,u,f];
            runMethodAtNo(arr,0,rotateNum,next);
        }
        //中棱归位优先还原一个面
        function step4Face(rotateNum){
            if(!isRotating){
                if(rotateNum>3){
                    rotateNum = rotateNum - 4;
                }
                currentFaceNo = rotateNum;
                var cube3 = getCubeByIndex(3,rotateNum);
                var cube4 = getCubeByIndex(4,rotateNum);
                var cube5 = getCubeByIndex(5,rotateNum);
                var cube6 = getCubeByIndex(6,rotateNum);
                var cube9 = getCubeByIndex(9,rotateNum);
                var cube19 = getCubeByIndex(19,rotateNum);
                var cube11 = getCubeByIndex(11,rotateNum);
                var cube14 = getCubeByIndex(14,rotateNum);
                var cube1 = getCubeByIndex(1,rotateNum);
                var cube21 = getCubeByIndex(21,rotateNum);
                var cube23 = getCubeByIndex(23,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);     
                var xLineAd = rotateAxisByYLine(XLineAd,rotateNum); 
                var zLineAd =  rotateAxisByYLine(ZLineAd,rotateNum);
                var zLine4Color = getFaceColorByVector(cube4,zLine);
                var xLineAd6Color = getFaceColorByVector(cube6,xLineAd);
                var xLine14Color = getFaceColorByVector(cube14,xLine);
                if(getFaceColorByVector(cube3,zLine)!=zLine4Color){
                    if(getFaceColorByVector(cube9,YLine)==zLine4Color&&
                        (getFaceColorByVector(cube9,xLineAd)==xLineAd6Color||rotateNum==startFaceNo)){
                        rotate402(rotateNum-1);
                        return;
                    }else if(getFaceColorByVector(cube9,xLineAd)==zLine4Color&&
                        (getFaceColorByVector(cube9,YLine)==xLineAd6Color||rotateNum==startFaceNo)){
                        u(0,function(){
                            rotate401(rotateNum-1);
                        });
                        return;
                    }else if((getFaceColorByVector(cube19,YLine)==zLine4Color&&
                        (getFaceColorByVector(cube19,zLineAd)==xLineAd6Color||rotateNum==startFaceNo))||
                        (getFaceColorByVector(cube19,zLineAd)==zLine4Color&&
                        (getFaceColorByVector(cube19,YLine)==xLineAd6Color||rotateNum==startFaceNo))||
                        (getFaceColorByVector(cube11,YLine)==zLine4Color&&
                        (getFaceColorByVector(cube11,xLine)==xLineAd6Color||rotateNum==startFaceNo))||
                        (getFaceColorByVector(cube11,xLine)==zLine4Color&&
                        (getFaceColorByVector(cube11,YLine)==xLineAd6Color||rotateNum==startFaceNo))||
                        (getFaceColorByVector(cube1,YLine)==zLine4Color&&
                        (getFaceColorByVector(cube1,zLine)==xLineAd6Color||rotateNum==startFaceNo))||
                        (getFaceColorByVector(cube1,zLine)==zLine4Color&&
                        (getFaceColorByVector(cube1,YLine)==xLineAd6Color||rotateNum==startFaceNo))){
                        U(0);
                        return;
                    }else if(getFaceColorByVector(cube5,zLine)==zLine4Color&&
                        (getFaceColorByVector(cube5,xLine)==xLineAd6Color||rotateNum==startFaceNo)){
                        rotate401Opposite(rotateNum);
                        return;
                    }else if(getFaceColorByVector(cube3,xLineAd)==zLine4Color&&
                        (getFaceColorByVector(cube3,zLine)==xLineAd6Color||rotateNum==startFaceNo)){
                        var tempNum = rotateNum-1;
                        rotate402(tempNum,function(){
                            U(tempNum,function(){
                                rotate401(tempNum);
                            });
                        });
                        return;
                    }else if(getFaceColorByVector(cube23,xLine)==zLine4Color&&
                        (getFaceColorByVector(cube23,zLineAd)==xLineAd6Color||rotateNum==startFaceNo)){
                        rotate402Opposite(rotateNum-3);
                        return;
                    }else if(getFaceColorByVector(cube23,zLineAd)==zLine4Color&&
                        (getFaceColorByVector(cube23,xLine)==xLineAd6Color||rotateNum==startFaceNo)){
                        rotate402Opposite(rotateNum-3);
                        return;
                    }else if(getFaceColorByVector(cube5,xLine)==zLine4Color&&
                        (getFaceColorByVector(cube5,zLine)==xLineAd6Color||rotateNum==startFaceNo)){
                        rotate402Opposite(rotateNum);
                        return;
                    }else if((getFaceColorByVector(cube21,xLineAd)==zLine4Color||getFaceColorByVector(cube21,zLineAd)==zLine4Color)&&rotateNum<=0){
                        //除非是刚开始否则不能影响已经还原好的面
                        rotate402Opposite(rotateNum-2);
                        return;
                    }
                }
                if(getFaceColorByVector(cube5,zLine)!=zLine4Color){
                    if(getFaceColorByVector(cube11,YLine)==zLine4Color&&
                        (getFaceColorByVector(cube11,xLine)==xLine14Color||rotateNum!=endFaceNo)){
                        rotate401(rotateNum);
                        return;
                    }else if(getFaceColorByVector(cube11,xLine)==zLine4Color&&
                        (getFaceColorByVector(cube11,YLine)==xLine14Color||rotateNum!=endFaceNo)){
                        U(0,function(){
                            rotate402(rotateNum);
                        });
                        return;
                    }else if((getFaceColorByVector(cube1,YLine)==zLine4Color&&
                        (getFaceColorByVector(cube1,zLine)==xLine14Color||rotateNum!=endFaceNo))||
                        (getFaceColorByVector(cube1,zLine)==zLine4Color&&
                        (getFaceColorByVector(cube1,YLine)==xLine14Color||rotateNum!=endFaceNo))||
                        (getFaceColorByVector(cube9,YLine)==zLine4Color&&
                        (getFaceColorByVector(cube9,xLineAd)==xLine14Color||rotateNum!=endFaceNo))||
                        (getFaceColorByVector(cube9,xLineAd)==zLine4Color&&
                        (getFaceColorByVector(cube9,YLine)==xLine14Color||rotateNum!=endFaceNo))||
                        (getFaceColorByVector(cube19,YLine)==zLine4Color&&
                        (getFaceColorByVector(cube19,zLineAd)==xLine14Color||rotateNum!=endFaceNo))||
                        (getFaceColorByVector(cube19,zLineAd)==zLine4Color&&
                        (getFaceColorByVector(cube19,YLine)==xLine14Color||rotateNum!=endFaceNo))){
                        u(0);
                        return;
                    }else if(getFaceColorByVector(cube5,xLine)==zLine4Color&&
                        (getFaceColorByVector(cube5,zLine)==xLine14Color||rotateNum!=endFaceNo)){
                        rotate402Opposite(rotateNum);
                        return;
                    }else if((getFaceColorByVector(cube21,xLineAd)==zLine4Color||getFaceColorByVector(cube21,zLineAd)==zLine4Color)&&rotateNum<=0){
                        //除非是刚开始否则不能影响已经还原好的面
                        rotate402Opposite(rotateNum-2);
                        return;
                    }else if(getFaceColorByVector(cube23,zLineAd)==zLine4Color&&rotateNum==startFaceNo){
                        rotate402Opposite(rotateNum-3);
                        return;
                    }else if(getFaceColorByVector(cube23,xLine)==zLine4Color&&
                        (getFaceColorByVector(cube23,zLineAd)==xLine14Color||rotateNum!=endFaceNo)){
                        rotate402Opposite(rotateNum-3);
                        return;
                    }
                }
                if(getFaceColorByVector(cube3,zLine)!=zLine4Color||getFaceColorByVector(cube5,zLine)!=zLine4Color){
                    //某个面出现极端情况，以该面为起始面重新还原
                    startFaceNo = currentFaceNo;
                    if(startFaceNo>0){
                        endFaceNo = startFaceNo-1;
                    }else{
                        endFaceNo = 3;
                    }
                }else{
                    currentFaceNo++;
                    if(currentFaceNo>3){
                        currentFaceNo = 0;
                    }
                }
                step4();
            }
        }
        //判断是否完成第四步 中棱归位
        function checkStep4(){
            if(!checkStep3()){
                return false;
            }
            var cube3 = getCubeByIndex(3);
            var cube4 = getCubeByIndex(4);
            var cube5 = getCubeByIndex(5);
            var zLine3Color = getFaceColorByVector(cube3,ZLine);
            if(getFaceColorByVector(cube4,ZLine)!=zLine3Color||
                getFaceColorByVector(cube5,ZLine)!=zLine3Color){
                return false;
            }
            var cube14 = getCubeByIndex(14);
            var cube23 = getCubeByIndex(23);
            var xLine5Color = getFaceColorByVector(cube5,XLine);
            if(getFaceColorByVector(cube14,XLine)!=xLine5Color||
                getFaceColorByVector(cube23,XLine)!=xLine5Color){
                return false;
            }
            var cube21 = getCubeByIndex(21);
            var cube22 = getCubeByIndex(22);
            var zLineAd23Color = getFaceColorByVector(cube23,ZLineAd);
            if(getFaceColorByVector(cube21,ZLineAd)!=zLineAd23Color||
                getFaceColorByVector(cube22,ZLineAd)!=zLineAd23Color){
                return false;
            }
            var cube12 = getCubeByIndex(12);
            var xLineAd3Color = getFaceColorByVector(cube3,XLineAd);
            if(getFaceColorByVector(cube12,XLineAd)!=xLineAd3Color||
                getFaceColorByVector(cube21,XLineAd)!=xLineAd3Color){
                return false;
            }
            return true;
        }
        //第三步底角归位
        function step3(){
            if(checkStep3()){
                console.log('start step4');
                currentStep = 4;
                startFaceNo = 0;
                endFaceNo = 3;
                step4();
                return;
            }
            step3Case1(0);
            step3Case1(1);
            step3Case1(2);
            step3Case1(3);
            step3Case2(0);
            step3Case2(1);
            step3Case2(2);
            step3Case2(3);
            step3Case3(0);
            step3Case3(1);
            step3Case3(2);
            step3Case3(3);
            step3Case4(0);
            step3Case4(1);
            step3Case4(2);
            step3Case4(3);
            step3Case5(0);
            step3Case5(1);
            step3Case5(2);
            step3Case5(3);
            if(!isRotating){
                isAutoReset = false;
                console.log('something wrong in step3');
            }
        }
        //底角归位第一种情况
        function step3Case1(rotateNum,startNum){
            if(!isRotating){
                var cube2 = getCubeByIndex(2,rotateNum);
                var cube4 = getCubeByIndex(4,rotateNum);
                var cube7 = getCubeByIndex(7,rotateNum);
                var cube14 = getCubeByIndex(14,rotateNum);
                var cube17 = getCubeByIndex(17,rotateNum);
                var cube8 = getCubeByIndex(8,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var zLineAd = rotateAxisByYLine(ZLineAd,rotateNum);
                var xLineAd = rotateAxisByYLine(XLineAd,rotateNum);
                var zLine2Color = getFaceColorByVector(cube2,zLine);
                var yLine2Color = getFaceColorByVector(cube2,YLine);
                if(getFaceColorByVector(cube2,xLine)==bottomColor&&!cube2.skipNext){
                    if(getFaceColorByVector(cube8,YLineAd)!=bottomColor&&
                        getFaceColorByVector(cube4,zLine)==zLine2Color&&
                        getFaceColorByVector(cube7,zLine)==zLine2Color&& 
                        getFaceColorByVector(cube14,xLine)==yLine2Color&&
                        getFaceColorByVector(cube17,xLine)==yLine2Color){
                        R(rotateNum,function(){
                            U(rotateNum,function(){
                                r(rotateNum)
                            })
                        })
                    }else{
                        u(rotateNum,function(){
                            rotateNum++;
                            if(rotateNum>=4){
                                rotateNum = 0;
                            }
                            if(startNum!=rotateNum){//防止重复检测造成无限循环
                                if(startNum==null||startNum==undefined){
                                    startNum = rotateNum-1;
                                    step3Case1(rotateNum,startNum);
                                }else{
                                    step3Case1(rotateNum,startNum);
                                }
                            }else{
                                var cube2 = getCubeByIndex(2,rotateNum);
                                cube2.skipNext = true;//下一次不进入判断
                                step3();
                            }
                        })
                    }
                }
            }
        }
        //底角归位第二种情况
        function step3Case2(rotateNum,startNum){
            if(!isRotating){
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var zLineAd = rotateAxisByYLine(ZLineAd,rotateNum);
                var xLineAd = rotateAxisByYLine(XLineAd,rotateNum);
                var cube2 = getCubeByIndex(2,rotateNum);
                var cube4 = getCubeByIndex(4,rotateNum);
                var cube7 = getCubeByIndex(7,rotateNum);
                var cube14 = getCubeByIndex(14,rotateNum);
                var cube17 = getCubeByIndex(17,rotateNum);
                var cube8 = getCubeByIndex(8,rotateNum);
                var yLine2Color = getFaceColorByVector(cube2,YLine);
                var xLine2Color = getFaceColorByVector(cube2,xLine);
                if(getFaceColorByVector(cube2,zLine)==bottomColor&&!cube2.skipNext){
                    if(getFaceColorByVector(cube8,YLineAd)!=bottomColor&&
                        getFaceColorByVector(cube4,zLine)==yLine2Color&&
                        getFaceColorByVector(cube7,zLine)==yLine2Color&&
                        getFaceColorByVector(cube14,xLine)==xLine2Color&&
                        getFaceColorByVector(cube17,xLine)==xLine2Color){
                        f(rotateNum,function(){
                            u(rotateNum,function(){
                                F(rotateNum)
                            })
                        })
                    }else{
                        u(rotateNum,function(){
                            rotateNum++;
                            if(rotateNum>=4){
                                rotateNum = 0;
                            }
                            if(startNum!=rotateNum){//防止重复检测造成无限循环
                                if(startNum==null||startNum==undefined){
                                    startNum = rotateNum-1;
                                    step3Case2(rotateNum,startNum);
                                }else{
                                    step3Case2(rotateNum,startNum);
                                }
                            }else{
                                var cube2 = getCubeByIndex(2,rotateNum);
                                cube2.skipNext = true;//下一次不进入判断
                                step3();
                            }
                        })
                    }
                }
            }
        }
        //底角归位第三种情况
        function step3Case3(rotateNum,startNum){
            if(!isRotating){
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var zLineAd = rotateAxisByYLine(ZLineAd,rotateNum);
                var xLineAd = rotateAxisByYLine(XLineAd,rotateNum);
                var cube2 = getCubeByIndex(2,rotateNum);
                var cube14 = getCubeByIndex(14,rotateNum);
                var cube4 = getCubeByIndex(4,rotateNum);
                var cube7 = getCubeByIndex(7,rotateNum);
                var cube8 = getCubeByIndex(8,rotateNum);
                var cube17 = getCubeByIndex(17,rotateNum);
                var zLine2Color = getFaceColorByVector(cube2,zLine);
                var xLine2Color = getFaceColorByVector(cube2,xLine);
                if(getFaceColorByVector(cube2,YLine)==bottomColor&&!cube2.skipNext){
                    if(getFaceColorByVector(cube8,YLineAd)!=bottomColor&&
                        getFaceColorByVector(cube14,xLine)==zLine2Color&&
                        getFaceColorByVector(cube17,xLine)==zLine2Color&&
                        getFaceColorByVector(cube4,zLine)==xLine2Color&&
                        getFaceColorByVector(cube7,zLine)==xLine2Color){
                        //转换为第二种情况
                           f(rotateNum,function(){
                               u(rotateNum,function(){
                                   u(rotateNum,function(){
                                       F(rotateNum,function(){
                                           U(rotateNum)
                                       })
                                   })
                               })
                           })
                    }else{
                        u(rotateNum,function(){
                            rotateNum++;
                            if(rotateNum>=4){
                                rotateNum = 0;
                            }
                            if(startNum!=rotateNum){//防止重复检测造成无限循环
                                if(startNum==null||startNum==undefined){
                                    startNum = rotateNum-1;
                                    step3Case3(rotateNum,startNum);
                                }else{
                                    step3Case3(rotateNum,startNum);
                                }
                            }else{
                                var cube2 = getCubeByIndex(2,rotateNum);
                                cube2.skipNext = true;//下一次不进入判断
                                step3();
                            }
                        })
                    }
                }
            }
        }
        //底角归位第四种情况
        function step3Case4(rotateNum){
            if(!isRotating){
                var cube8 = getCubeByIndex(8,rotateNum);
                var cube17 = getCubeByIndex(17,rotateNum);
                var cube14 = getCubeByIndex(14,rotateNum);
                var cube4 = getCubeByIndex(4,rotateNum);
                var cube7 = getCubeByIndex(7,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var zLine8Color = getFaceColorByVector(cube8,zLine);
                var yLineAd8Color = getFaceColorByVector(cube8,YLineAd);
                if(getFaceColorByVector(cube8,xLine)==bottomColor){
                    if(getFaceColorByVector(cube17,xLine)==zLine8Color&&
                        getFaceColorByVector(cube14,xLine)==zLine8Color&&
                        getFaceColorByVector(cube4,zLine)==yLineAd8Color&&
                        getFaceColorByVector(cube7,zLine)==yLineAd8Color){
                        //转换为第一种情况
                        f(rotateNum,function(){
                            U(rotateNum,function(){
                                F(rotateNum)
                            })
                        })
                    }else{
                        //转换为第三种情况
                        f(rotateNum,function(){
                            u(rotateNum,function(){
                                F(rotateNum)
                            })
                        })
                    }
                }
            }
        }
        //底角归位第五种情况
        function step3Case5(rotateNum){
            if(!isRotating){
                var cube8 = getCubeByIndex(8,rotateNum);
                var cube4 = getCubeByIndex(4,rotateNum);
                var cube7 = getCubeByIndex(7,rotateNum);
                var cube14 = getCubeByIndex(14,rotateNum);
                var cube17 = getCubeByIndex(17,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var xLine8Color = getFaceColorByVector(cube8,xLine);
                var yLineAd8Color = getFaceColorByVector(cube8,YLineAd);
                if(getFaceColorByVector(cube8,zLine)==bottomColor){
                    if(getFaceColorByVector(cube7,zLine)==xLine8Color&&
                        getFaceColorByVector(cube4,zLine)==xLine8Color&&
                        getFaceColorByVector(cube14,xLine)==yLineAd8Color&&
                        getFaceColorByVector(cube17,xLine)==yLineAd8Color){
                        //转换为第二种情况
                        f(rotateNum,function(){
                            u(rotateNum,function(){
                                F(rotateNum,function(){
                                    U(rotateNum)
                                })
                            })
                        })
                    }else{
                        //转换为第三种情况
                        R(rotateNum,function(){
                            u(rotateNum,function(){
                                r(rotateNum)
                            })
                        })
                    }
                }
            }
        }
        //判断是否完成第三步底角归位
        function checkStep3Item(indexs,line){
            if(indexs.length>0){
                var arr = getCubeByIndexs(indexs);
                for(var i=1;i<arr.length;i++){
                    if(getFaceColorByVector(arr[i],line)!=getFaceColorByVector(arr[0],line)){
                        return false;
                    }
                    if(getFaceColorByVector(arr[i],YLineAd)!=bottomColor){
                        return false;
                    }
                }
            }
            return true;
        }
        function checkStep3(){
            var result = true;
            var indexs1 = [4,6,7,8];
            result = checkStep3Item(indexs1,ZLine);
            if(!result){
                return result;
            }
            var indexs2 = [14,8,17,26];
            result = checkStep3Item(indexs2,XLine);
            if(!result){
                return result;
            }
            var indexs3 = [22,24,25,26];
            result = checkStep3Item(indexs3,ZLineAd);
            if(!result){
                return result;
            }
            var indexs4 = [12,6,15,24];
            result = checkStep3Item(indexs4,XLineAd);
            if(!result){
                return result;
            }
            return result;
        }
        
        //第二步底棱归位
        function step2(){
            if(checkStep2()){
                console.log('start step3');
                currentStep = 3;
                step3();
                return;
            }
            step2Case1(0);
            step2Case1(1);
            step2Case1(2);
            step2Case1(3);
            step2Case2(0);
            step2Case2(1);
            step2Case2(2);
            step2Case2(3);
            step2Case3(0);
            step2Case3(1);
            step2Case3(2);
            step2Case3(3);
            if(!isRotating){
                isAutoReset = false;
                console.log('something wrong in step2');
            }
        }
        //底棱归位第一种情况
        function step2Case1(rotateNum){
            if(!isRotating){
                var cube1 = getCubeByIndex(1,rotateNum);
                var cube4 = getCubeByIndex(4,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                if(getFaceColorByVector(cube1,YLine)==bottomColor){
                    if(getFaceColorByVector(cube1,zLine)==getFaceColorByVector(cube4,zLine)){
                        F(rotateNum,function(){
                            F(rotateNum);
                        });
                    }else{
                        u(rotateNum,function(){
                            rotateNum++;
                            if(rotateNum>=4){
                                rotateNum = 0;
                            }
                            step2Case1(rotateNum);
                        });
                    }
                }
            }
        }
        //底棱归位第二种情况
        function step2Case2(rotateNum){
            if(!isRotating){
                var cube7 = getCubeByIndex(7,rotateNum);
                var cube8 = getCubeByIndex(8,rotateNum);
                var cube2 = getCubeByIndex(2,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                if(getFaceColorByVector(cube7,YLineAd)==bottomColor&&
                    getFaceColorByVector(cube8,YLineAd)==bottomColor){
                    if(getCubeByIndex(cube2,xLine)!=bottomColor){
                        R(rotateNum,function(){
                            u(rotateNum,function(){
                                r(rotateNum);
                            });
                        })
                    }else{
                        f(rotateNum,function(){
                            u(rotateNum,function(){
                                F(rotateNum);
                            });
                        })
                    }
                }
            }
        }
        //底棱归位第三种情况
        function step2Case3(rotateNum){
            if(!isRotating){
                var cube7 = getCubeByIndex(7,rotateNum);
                var cube6 = getCubeByIndex(6,rotateNum);
                var cube0 = getCubeByIndex(0,rotateNum);
                var xLineAd = rotateAxisByYLine(XLineAd,rotateNum);
                if(getFaceColorByVector(cube7,YLineAd)==bottomColor&&
                    getFaceColorByVector(cube6,YLineAd)==bottomColor){
                    if(getFaceColorByVector(cube0,xLineAd)!=bottomColor){
                        l(rotateNum,function(){
                            u(rotateNum,function(){
                                L(rotateNum)
                            });
                        })
                    }else{
                        f(rotateNum,function(){
                            u(rotateNum,function(){
                                F(rotateNum);
                            });
                        })
                    }
                }
            }
        }
        /**
         * 判断是否完成第二部底棱归位（严格底十字）
         */
        function checkStep2(){
            var indexs = [4,7,14,17,22,25,12,15];
            var lines = [ZLine,XLine,ZLineAd,XLineAd];
            var arr = getCubeByIndexs(indexs);
            for(var i=0;i<arr.length;i++){
                var no = parseInt(i/2);
                var color1 = getFaceColorByVector(arr[i],lines[no]);
                if(color1==topColor||color1==bottomColor){//不能为顶色和底色
                    return false;
                }
                if(i%2==0){
                    var color2 = getFaceColorByVector(arr[i+1],lines[no]);
                    if(color1!=color2){//两两相同
                        return false;
                    }
                }
            }
            //强制底十字
            for(var i=1;i<arr.length;i=i+2){
                var color = getFaceColorByVector(arr[i],YLineAd);
                if(color!=bottomColor){
                    return false;
                }
            }
            indexs = [6,8,26,24];
            arr = getCubeByIndexs(indexs);
            for(var i=0;i<arr.length;i++){
                var color = getFaceColorByVector(arr[i],YLineAd);
                if(color==bottomColor){
                    return false;
                }
            }
            return true;
        }
        //第一步小白花
        function step1(){
            
            if(checkStep1()){
                console.log('start step2');
                currentStep = 2;
                step2();
                return;
            }
            
            step1Case1(0);
            step1Case1(1);
            step1Case1(2);
            step1Case1(3);
            step1Case2(0);
            step1Case2(1);
            step1Case2(2);
            step1Case2(3);
            step1Case3(0);
            step1Case3(1);
            step1Case3(2);
            step1Case3(3);
            
            step1Case4(0);
            step1Case4(1);
            step1Case4(2);
            step1Case4(3);
            if(!isRotating){
                isAutoReset = false;
                console.log('something wrong in step1');
            }
        }
        //判断是否完成第一步小白花
        function checkStep1(){
            var indexs = [1,9,11,19];
            var step1 = true;
            for(var i=0;i<indexs.length;i++){
                var item = getCubeByIndex(indexs[i]);
                var color = getFaceColorByVector(item,YLine);//获取上表面颜色
                if(color!=bottomColor){
                    step1 = false;
                    break;
                }
            }
            return step1;
        }
        //小白花第一种情况
        function step1Case1(rotateNum){
            if(!isRotating){
                var cube3 = getCubeByIndex(3,rotateNum);
                var cube9 = getCubeByIndex(9,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var xLineAd = rotateAxisByYLine(XLineAd,rotateNum);
                if(getFaceColorByVector(cube3,zLine)==bottomColor){//101、107
                    if(getFaceColorByVector(cube9,YLine)!=bottomColor){
                        l(rotateNum);
                    }else{
                        u(rotateNum);
                    }
                }
            }
        }
        //小白花第二种情况
        function step1Case2(rotateNum){
            if(!isRotating){
                var cube5 = getCubeByIndex(5,rotateNum);
                var cube11 = getCubeByIndex(11,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                if(getFaceColorByVector(cube5,zLine)==bottomColor){
                    if(getFaceColorByVector(cube11,YLine)!=bottomColor){
                        R(rotateNum);
                    }else{
                        u(rotateNum);
                    }
                }
            }
        }
        //小白花第三种情况
        function step1Case3(rotateNum){
            if(!isRotating){
                var cube15 = getCubeByIndex(15,rotateNum);
                var cube9 = getCubeByIndex(9,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var xLineAd = rotateAxisByYLine(XLineAd,rotateNum);
                if(getFaceColorByVector(cube15,YLineAd)==bottomColor){//103、104
                    if(getFaceColorByVector(cube9,YLine)!=bottomColor){
                        l(rotateNum);
                    }else{
                        u(rotateNum);
                    }
                }
            }
        }
        //小白花第四种情况
        function step1Case4(rotateNum){
            if(!isRotating){
                var cube1 = getCubeByIndex(1,rotateNum);
                var cube7 = getCubeByIndex(7,rotateNum);
                var zLine = rotateAxisByYLine(ZLine,rotateNum);
                var xLine = rotateAxisByYLine(XLine,rotateNum);
                if(getFaceColorByVector(cube1,zLine)==bottomColor||getFaceColorByVector(cube7,zLine)==bottomColor){//105、106
                    if(getFaceColorByVector(cube1,YLine)!=bottomColor){
                        F(rotateNum);
                    }else{
                        D(rotateNum)
                    }
                }
            }
        }
        //按顺序执行数组里边的方法
        function runMethodAtNo(arr,no,rotateNum,next){
            if(no>=arr.length-1){
                if(next){
                    arr[no](rotateNum,next);
                }else{
                    arr[no](rotateNum);
                }
            }else{
                arr[no](rotateNum,function(){
                    if(no<arr.length-1){
                        no++
                        runMethodAtNo(arr,no,rotateNum,next);
                    }
                })
            }
        }
        /**
         * 魔方基本公式 U、F、L、D、R、u、f、l、d
         */
        function U(rotateNum,next){
            stepCount++;
            var cube2 = getCubeByIndex(2,rotateNum);
            var zLine = rotateAxisByYLine(ZLine,rotateNum);
            var xLineAd = rotateAxisByYLine(XLineAd,rotateNum);
            normalize = zLine;
            rotateMove(cube2,xLineAd,next);
        }
        function u(rotateNum,next){
            stepCount++;
            var cube2 = getCubeByIndex(2,rotateNum);
            var xLine = rotateAxisByYLine(XLine,rotateNum);
            var zLineAd = rotateAxisByYLine(ZLineAd,rotateNum);
            normalize = xLine;
            rotateMove(cube2,zLineAd,next);
        }
        function F(rotateNum,next){
            stepCount++;
            var cube2 = getCubeByIndex(2,rotateNum);
            var xLine = rotateAxisByYLine(XLine,rotateNum);
            normalize = xLine;
            rotateMove(cube2,YLineAd,next);
        }
        function f(rotateNum,next){
            stepCount++;
            var cube2 = getCubeByIndex(2,rotateNum);
            var xLineAd = rotateAxisByYLine(XLineAd,rotateNum);
            normalize = YLine;
            rotateMove(cube2,xLineAd,next)
        }
        function L(rotateNum,next){
            stepCount++;
            var cube0 = getCubeByIndex(0,rotateNum);
            var zLine = rotateAxisByYLine(ZLine,rotateNum);
            normalize = zLine;
            rotateMove(cube0,YLineAd,next);
        }
        function l(rotateNum,next){
            stepCount++;
            var cube0 = getCubeByIndex(0,rotateNum);
            var zLineAd = rotateAxisByYLine(ZLineAd,rotateNum);
            normalize = YLine;
            rotateMove(cube0,zLineAd,next);
        }
        function D(rotateNum,next){
            stepCount++;
            var cube8 = getCubeByIndex(8,rotateNum);
            var xLine = rotateAxisByYLine(XLine,rotateNum);
            var zLineAd = rotateAxisByYLine(ZLineAd,rotateNum);
            normalize = xLine;
            rotateMove(cube8,zLineAd,next);
        }
        function d(rotateNum,next){
            stepCount++;
            var cube8 = getCubeByIndex(8,rotateNum);
            var zLine = rotateAxisByYLine(ZLine,rotateNum);
            var xLineAd = rotateAxisByYLine(XLineAd,rotateNum);
            normalize = zLine;
            rotateMove(cube8,xLineAd,next);
        }
        function R(rotateNum,next){
            stepCount++;
            var cube2 = getCubeByIndex(2,rotateNum);
            var zLineAd = rotateAxisByYLine(ZLineAd,rotateNum);
            normalize = YLine;
            rotateMove(cube2,zLineAd,next);
        }
        function r(rotateNum,next){
            stepCount++;
            var cube2 = getCubeByIndex(2,rotateNum);
            var zLine = rotateAxisByYLine(ZLine,rotateNum);
            normalize = zLine;
            rotateMove(cube2,YLineAd,next);
        }
        function B(rotateNum,next){
            stepCount++;
            var cube20 = getCubeByIndex(20,rotateNum);
            var xLine = rotateAxisByYLine(XLine,rotateNum);
            normalize = xLine;
            rotateMove(cube20,YLine,next);
        }
        function b(rotateNum,next){
            stepCount++;
            var cube20 = getCubeByIndex(20,rotateNum);
            var xLine = rotateAxisByYLine(XLine,rotateNum);
            normalize = xLine;
            rotateMove(cube20,YLineAd,next);
        }
        //根据索引素组获取方块
        function getCubeByIndexs(indexs){
            var arr = [];
            for(var i=0;i<indexs.length;i++){
                arr.push(getCubeByIndex(indexs[i]));
            }
            return arr;
        }
        /**
         * 根据索引获取方块
         * @param  index     索引
         * @param  rotateNum 旋转次数
         */
        function getCubeByIndex(index,rotateNum){
            var tempIndex = index;
            var tempRotateNum = rotateNum;
            while(rotateNum>0){
                if(parseInt(index/9)==0){
                    if(index%3==0){
                        index += 2;
                    }else if(index%3==1){
                        index += 10;
                    }else if(index%3==2){
                        index += 18;
                    }
                }else if(index%3==2){
                    if(parseInt(index/9)==0){
                        index += 18;
                    }else if(parseInt(index/9)==1){
                        index += 8;
                    }else if(parseInt(index/9)==2){
                        index -= 2;
                    }
                }else if(parseInt(index/9)==2){
                    if(index%3==2){
                        index -= 2;
                    }else if(index%3==1){
                        index -= 10;
                    }else if(index%3==0){
                        index -= 18;
                    }
                }else if(index%3==0){
                    if(parseInt(index/9)==2){
                        index -= 18;
                    }else if(parseInt(index/9)==1){
                        index -= 8;
                    }else if(parseInt(index/9)==0){
                        index += 2;
                    }
                }
                rotateNum--;
            }
            var cube; 
            for(var i=0;i<cubes.length;i++){
                if(cubes[i].cubeIndex == index+minCubeIndex){
                    cube = cubes[i];
                }
            }
            return cube;
        }
        //根据Y轴旋转向量
        function rotateAxisByYLine(vector,rotateNum){
            while(rotateNum>0){
                if(vector.angleTo(XLine)==0){
                    vector = ZLineAd.clone();
                }else if(vector.angleTo(ZLineAd)==0){
                    vector = XLineAd.clone();
                }else if(vector.angleTo(XLineAd)==0){
                    vector = ZLine.clone();
                }else if(vector.angleTo(ZLine)==0){
                    vector = XLine.clone();
                }
                rotateNum--
            }
            return vector;
        }
        //根据颜色序号获取初始化时其对面颜色序号
        function getOppositeColor(no){
            if(no%2==0||no==0){
                return no+1;
            }else{
                return no-1;
            }
        }
        //获取法向量和已知向量方向相同的面的颜色序号
        function getFaceColorByVector(cube,vector){
            var materials = cube.material.materials;
            var faces = cube.geometry.faces;
            var normalMatrix = cube.normalMatrix;
            
            /**
             * 转换视角时摄像机位置发生了变动，模型开始上表面的法向量是世界坐标系的Y轴，现在依然是世界坐标系的Y轴；
             * 但是小方块面的法向量乘以其法向量矩阵得到的是视图坐标系中的向量；
             * 世界坐标系转换成视图坐标系需要乘以视图矩阵的逆反矩阵。
             */
            var viewMatrix = new THREE.Matrix4();
            viewMatrix.lookAt(camera.position,viewCenter,camera.up);
            viewMatrix.getInverse(viewMatrix);
            var tempVector = vector.clone();
            tempVector.applyMatrix4(viewMatrix);
            var angles = [];
            for(var i=0;i<faces.length;i++){
                var tempNormal = faces[i].normal.clone();
                tempNormal.applyMatrix3(normalMatrix);
                /**
                 * 按道理这里应该判断两向量夹角是否等于0，但是因为存在精度问题；
                 * 有可能得到的角度很接近0，但却不等于0，另外不确定到底保留几位小数合适；
                 * 因此使用判断最小值的方式。
                 */
                angles.push(tempNormal.angleTo(tempVector));
            }
            var minNo = min(angles).no;
            return faces[minNo].materialIndex;
            //document.body.appendChild(materials[faces[minNo].materialIndex].map.image);
             //$frame.style.display = 'none';
        }
        window.requestAnimFrame = (function() {//如果有变化则可能还需要requestAnimationFrame刷新
            return window.requestAnimationFrame ||
                   window.mozRequestAnimationFrame ||
                   window.webkitRequestAnimationFrame ||
                   window.msRequestAnimationFrame ||
                   window.webkitRequestAnimationFrame;
        })();
        //根据页面宽度和高度创建渲染器，并添加容器中
        var $frame = document.getElementById('canvas-frame');
        function initThree() {
            width = window.innerWidth;
            height = window.innerHeight;
            renderer = new THREE.WebGLRenderer({
                antialias : true
            });
            renderer.setSize(width, height);
            renderer.setClearColor(0xFFFFFF, 1.0);
            $frame.appendChild(renderer.domElement);
        }
        //创建相机，并设置正方向和中心点
        var camera;
        var controller;//视角控制器
        var viewCenter = new THREE.Vector3( 0, 0, 0 );
        function initCamera() {
            camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 600;
            camera.up.x = 0;//正方向
            camera.up.y = 1;
            camera.up.z = 0;
            camera.lookAt(viewCenter);
        }
        //创建场景，后续元素需要加入到场景中才会显示出来
        var scene;
        function initScene() {
            scene = new THREE.Scene();
        }
        //创建光线
        var light;
        function initLight() {
            light = new THREE.AmbientLight(0xfefefe);
            scene.add(light);
        }
        /**
         * 魔方
         * x、y、z 魔方正面左上角坐标
         * num 魔方单位方向上数量
         * len 魔方单位正方体宽高
         * colors 魔方六面体颜色
         */
        function SimpleCube(x,y,z,num,len,colors){
            var cubes = [];
            for(var i=0;i<num;i++){
                for(var j=0;j<num*num;j++){
                    var cubegeo = new THREE.BoxGeometry(len,len,len);
                    var materials = [];
                    var myFaces = [];
                    //一个小正方体有六个面，每个面使用相同材质的纹理，但是颜色不一样
                    myFaces.push(faces(colors[0]));
                    myFaces.push(faces(colors[1]));
                    myFaces.push(faces(colors[2]));
                    myFaces.push(faces(colors[3]));
                    myFaces.push(faces(colors[4]));
                    myFaces.push(faces(colors[5]));
                    for (var k = 0; k < 6; k++) {
                        var texture = new THREE.Texture(myFaces[k]);
                        texture.needsUpdate = true;
                        materials.push(new THREE.MeshLambertMaterial({
                            map: texture
                        }));
                    }
                    var cubemat = new THREE.MeshFaceMaterial(materials);
                    var cube = new THREE.Mesh( cubegeo, cubemat );
                    //假设整个魔方的中心在坐标系原点，推出每个小正方体的中心
                    cube.position.x = (x+len/2)+(j%3)*len;
                    cube.position.y = (y-len/2)-parseInt(j/3)*len;
                    cube.position.z = (z-len/2)-i*len;
                    cube.matrixWorldNeedsUpdate = true;
                    cubes.push(cube)
                }
            }
            return cubes;
        }
        //生成canvas素材
        function faces(rgbaColor) {
            var canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            var context = canvas.getContext('2d');
            if (context) {
                //画一个宽高都是256的黑色正方形
                canvas.setAttribute('color',rgbaColor);
                context.fillStyle = 'rgba(0,0,0,1)';
                context.fillRect(0, 0, 256, 256);
                //在内部用某颜色的16px宽的线再画一个宽高为224的圆角正方形并用改颜色填充
                context.rect(16, 16, 224, 224);
                context.lineJoin = 'round';
                context.lineWidth = 16;
                context.fillStyle = rgbaColor;
                context.strokeStyle = rgbaColor;
                context.stroke();
                context.fill();
            } else {
                alert('您的浏览器不支持Canvas无法预览.\n');
            }
            return canvas;
        }
        //创建展示场景所需的各种元素
        var cubes
        function initObject() {
            //生成魔方小正方体
            cubes = SimpleCube(CubeParams.x,CubeParams.y,CubeParams.z,CubeParams.num,CubeParams.len,CubeParams.colors);
            var ids = [];   
            for(var i=0;i<cubes.length;i++){
                var item = cubes[i];
                /**
                 * 由于筛选运动元素时是根据物体的id规律来的，但是滚动之后位置发生了变化；
                 * 再根据初始规律筛选会出问题，而且id是只读变量；
                 * 所以这里给每个物体设置一个额外变量cubeIndex，每次滚动之后更新根据初始状态更新该cubeIndex；
                 * 让该变量一直保持初始规律即可。
                 */
                initStatus.push({
                    x:item.position.x,
                    y:item.position.y,
                    z:item.position.z,
                    cubeIndex:item.id
                });
                item.cubeIndex = item.id;
                ids.push(item.id);
                scene.add(cubes[i]);//并依次加入到场景中
            }
            minCubeIndex = min(ids).value;
            //透明正方体
            var cubegeo = new THREE.BoxGeometry(150,150,150);
            var hex = 0x000000;
            for ( var i = 0; i < cubegeo.faces.length; i += 2 ) {
                cubegeo.faces[ i ].color.setHex( hex );
                cubegeo.faces[ i + 1 ].color.setHex( hex );
            }
            var cubemat = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors,opacity: 0, transparent: true});
            var cube = new THREE.Mesh( cubegeo, cubemat );
            cube.cubeType = 'coverCube';
            scene.add( cube );
        }
        //渲染
        function render(){
            renderer.clear();
            renderer.render(scene, camera);
            window.requestAnimFrame(render);
        }
        //开始
        function threeStart() {
            initThree();
            initCamera();
            initScene();
            initLight();
            initObject();
            render();
            //监听鼠标事件
            renderer.domElement.addEventListener('mousedown', startCube, false);
            renderer.domElement.addEventListener('mousemove', moveCube, false );
            renderer.domElement.addEventListener('mouseup', stopCube,false);
            //监听触摸事件
            renderer.domElement.addEventListener('touchstart', startCube, false);
            renderer.domElement.addEventListener('touchmove', moveCube, false);
            renderer.domElement.addEventListener('touchend', stopCube, false);
            //视角控制
            controller = new THREE.OrbitControls(camera, renderer.domElement);
            controller.target = viewCenter;//设置控制点
            //自动还原一
            var $autoResetV1 = document.querySelector('#autoResetV1');
            $autoResetV1.addEventListener('click',function(){
                autoResetV1(cubes)
            },false);
            //随机旋转
            var $randomRotate = document.querySelector('#randomRotate');
            $randomRotate.addEventListener('click',function(){
                randomRotate();
            },false);
        }
        //魔方操作结束
        function stopCube(){
            intersect = null;
            startPoint = null
        }
        //绕着世界坐标系的某个轴旋转
        function rotateAroundWorldY(obj,rad){
            var x0 = obj.position.x;
            var z0 = obj.position.z;
            /**
             * 因为物体本身的坐标系是随着物体的变化而变化的，
             * 所以如果使用rotateZ、rotateY、rotateX等方法，
             * 多次调用后就会出问题，先改为Quaternion实现。
             */
            var q = new THREE.Quaternion(); 
            q.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), rad );
            obj.quaternion.premultiply( q );
            //obj.rotateY(rad);
            obj.position.x = Math.cos(rad)*x0+Math.sin(rad)*z0;
            obj.position.z = Math.cos(rad)*z0-Math.sin(rad)*x0;
        }
        function rotateAroundWorldZ(obj,rad){
            var x0 = obj.position.x;
            var y0 = obj.position.y;
            var q = new THREE.Quaternion(); 
            q.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), rad );
            obj.quaternion.premultiply( q );
            //obj.rotateZ(rad);
            obj.position.x = Math.cos(rad)*x0-Math.sin(rad)*y0;
            obj.position.y = Math.cos(rad)*y0+Math.sin(rad)*x0;
        }
        function rotateAroundWorldX(obj,rad){
            var y0 = obj.position.y;
            var z0 = obj.position.z;
            var q = new THREE.Quaternion(); 
            q.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), rad );
            obj.quaternion.premultiply( q );
            //obj.rotateX(rad);
            obj.position.y = Math.cos(rad)*y0-Math.sin(rad)*z0;
            obj.position.z = Math.cos(rad)*z0+Math.sin(rad)*y0;
        }
        //滑动操作魔方
        function moveCube(event){
            getIntersects(event);
            if(intersect){
                if(!isRotating&&startPoint){//魔方没有进行转动且满足进行转动的条件
                    movePoint = intersect.point;
                    if(!movePoint.equals(startPoint)){//和起始点不一样则意味着可以得到转动向量了
                        var sub = movePoint.sub(startPoint);//计算转动向量
                        rotateMove(intersect.object,sub);
                    }
                }
            }
            event.preventDefault();
        }
        //某方块在某个方向转动
        function rotateMove(target,vector,next){
            isRotating = true;//转动标识置为true
            var direction = getDirection(vector);//获得方向
            var elements = getBoxs(target,direction);
            var startTime = new Date().getTime();
            window.requestAnimFrame(function(timestamp){
                rotateAnimation(elements,direction,timestamp,0,null,next);
            });
        }
        /**
         * 旋转动画
         */
        function rotateAnimation(elements,direction,currentstamp,startstamp,laststamp,next){
            var totalTime = 200;//转动的总运动时间
            var isLastRotate = false;//是否是某次转动最后一次动画
            if(startstamp===0){
                startstamp = currentstamp;
                laststamp = currentstamp;
            }
            if(currentstamp-startstamp>=totalTime){
                currentstamp = startstamp+totalTime;
                isLastRotate = true;
            }
            switch(direction){
                //绕z轴顺时针
                case 0.1:
                case 1.2:
                case 2.4:
                case 3.3:
                    for(var i=0;i<elements.length;i++){
                        rotateAroundWorldZ(elements[i],-90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                    }
                    break;
                //绕z轴逆时针
                case 0.2:
                case 1.1:
                case 2.3:
                case 3.4:
                    for(var i=0;i<elements.length;i++){
                        rotateAroundWorldZ(elements[i],90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                    }
                    break;
                //绕y轴顺时针
                case 0.4:
                case 1.3:
                case 4.3:
                case 5.4:
                    for(var i=0;i<elements.length;i++){
                        rotateAroundWorldY(elements[i],-90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                    }
                    break;
                //绕y轴逆时针
                case 1.4:
                case 0.3:
                case 4.4:
                case 5.3:
                    for(var i=0;i<elements.length;i++){
                        rotateAroundWorldY(elements[i],90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                    }
                    break;
                //绕x轴顺时针
                case 2.2:
                case 3.1:
                case 4.1:
                case 5.2:
                    for(var i=0;i<elements.length;i++){
                        rotateAroundWorldX(elements[i],90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                    }
                    break;
                //绕x轴逆时针
                case 2.1:
                case 3.2:
                case 4.2:
                case 5.1:
                    for(var i=0;i<elements.length;i++){
                        rotateAroundWorldX(elements[i],-90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                    }
                    break;
                default:
                    break;
            }
            if(!isLastRotate){
                window.requestAnimFrame(function(timestamp){
                    rotateAnimation(elements,direction,timestamp,startstamp,currentstamp,next);
                });
            }else{
                isRotating = false;
                startPoint = null;
                updateCubeIndex(elements);
                if(next){
                    next();
                }else{
                    if(isAutoReset){
                        switch(currentStep){
                            case 1:
                                step1();
                                break;
                            case 2:
                                step2();
                                break;
                            case 3:
                                step3();
                                break;
                            case 4:
                                step4();
                                break;
                            case 5:
                                step5();
                                break;
                            case 6:
                                step6();
                                break;
                            case 7:
                                step7();
                                break;
                            case 8:
                                step8();
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
        //更新位置索引
        function updateCubeIndex(elements){
            for(var i=0;i<elements.length;i++){
                var temp1 = elements[i];
                for(var j=0;j<initStatus.length;j++){
                    var temp2 = initStatus[j];
                    if( Math.abs(temp1.position.x - temp2.x)<=CubeParams.len/2 && 
                        Math.abs(temp1.position.y - temp2.y)<=CubeParams.len/2 && 
                        Math.abs(temp1.position.z - temp2.z)<=CubeParams.len/2 ){
                        temp1.cubeIndex = temp2.cubeIndex;
                        temp1.skipNext = false;
                        break;
                    }
                }
            }
        }
        //根据方向获得运动元素
        function getBoxs(target,direction){
            var targetId = target.cubeIndex;
            targetId = targetId-minCubeIndex;
            var numI = parseInt(targetId/9);
            var numJ = targetId%9;
            var boxs = [];
            //根据绘制时的规律判断 no = i*9+j
            switch(direction){
                //绕z轴
                case 0.1:
                case 0.2:
                case 1.1:
                case 1.2:
                case 2.3:
                case 2.4:
                case 3.3:
                case 3.4:
                    for(var i=0;i<cubes.length;i++){
                        var tempId = cubes[i].cubeIndex-minCubeIndex;
                        if(numI===parseInt(tempId/9)){
                            boxs.push(cubes[i]);
                        }
                    }
                    break;
                //绕y轴
                case 0.3:
                case 0.4:
                case 1.3:
                case 1.4:
                case 4.3:
                case 4.4:
                case 5.3:
                case 5.4:
                    for(var i=0;i<cubes.length;i++){
                        var tempId = cubes[i].cubeIndex-minCubeIndex;
                        if(parseInt(numJ/3)===parseInt(tempId%9/3)){
                            boxs.push(cubes[i]);
                        }
                    }
                    break;
                //绕x轴
                case 2.1:
                case 2.2:
                case 3.1:
                case 3.2:
                case 4.1:
                case 4.2:
                case 5.1:
                case 5.2:
                    for(var i=0;i<cubes.length;i++){
                        var tempId = cubes[i].cubeIndex-minCubeIndex;
                        if(tempId%9%3===numJ%3){
                            boxs.push(cubes[i]);
                        }
                    }
                    break;
                default:
                    break;
            }
            return boxs;
        }
        //获得旋转方向
        function getDirection(vector3){
            var direction;
            //判断差向量和x、y、z轴的夹角
            var xAngle = vector3.angleTo(XLine);
            var xAngleAd = vector3.angleTo(XLineAd);
            var yAngle = vector3.angleTo(YLine);
            var yAngleAd = vector3.angleTo(YLineAd);
            var zAngle = vector3.angleTo(ZLine);
            var zAngleAd = vector3.angleTo(ZLineAd);
            var minAngle = min([xAngle,xAngleAd,yAngle,yAngleAd,zAngle,zAngleAd]).value;//最小夹角
            switch(minAngle){
                case xAngle:
                    direction = 0;//向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
                    if(normalize.equals(YLine)){
                        direction = direction+0.1;//绕z轴顺时针
                    }else if(normalize.equals(YLineAd)){
                        direction = direction+0.2;//绕z轴逆时针
                    }else if(normalize.equals(ZLine)){
                        direction = direction+0.3;//绕y轴逆时针
                    }else{
                        direction = direction+0.4;//绕y轴顺时针
                    }
                    break;
                case xAngleAd:
                    direction = 1;//向x轴反方向旋转90度
                    if(normalize.equals(YLine)){
                        direction = direction+0.1;//绕z轴逆时针
                    }else if(normalize.equals(YLineAd)){
                        direction = direction+0.2;//绕z轴顺时针
                    }else if(normalize.equals(ZLine)){
                        direction = direction+0.3;//绕y轴顺时针
                    }else{
                        direction = direction+0.4;//绕y轴逆时针
                    }
                    break;
                case yAngle:
                    direction = 2;//向y轴正方向旋转90度
                    if(normalize.equals(ZLine)){
                        direction = direction+0.1;//绕x轴逆时针
                    }else if(normalize.equals(ZLineAd)){
                        direction = direction+0.2;//绕x轴顺时针
                    }else if(normalize.equals(XLine)){
                        direction = direction+0.3;//绕z轴逆时针
                    }else{
                        direction = direction+0.4;//绕z轴顺时针
                    }
                    break;
                case yAngleAd:
                    direction = 3;//向y轴反方向旋转90度
                    if(normalize.equals(ZLine)){
                        direction = direction+0.1;//绕x轴顺时针
                    }else if(normalize.equals(ZLineAd)){
                        direction = direction+0.2;//绕x轴逆时针
                    }else if(normalize.equals(XLine)){
                        direction = direction+0.3;//绕z轴顺时针
                    }else{
                        direction = direction+0.4;//绕z轴逆时针
                    }
                    break;
                case zAngle:
                    direction = 4;//向z轴正方向旋转90度
                    if(normalize.equals(YLine)){
                        direction = direction+0.1;//绕x轴顺时针
                    }else if(normalize.equals(YLineAd)){
                        direction = direction+0.2;//绕x轴逆时针
                    }else if(normalize.equals(XLine)){
                        direction = direction+0.3;//绕y轴顺时针
                    }else{
                        direction = direction+0.4;//绕y轴逆时针
                    }
                    break;
                case zAngleAd:
                    direction = 5;//向z轴反方向旋转90度
                    if(normalize.equals(YLine)){
                        direction = direction+0.1;//绕x轴逆时针
                    }else if(normalize.equals(YLineAd)){
                        direction = direction+0.2;//绕x轴顺时针
                    }else if(normalize.equals(XLine)){
                        direction = direction+0.3;//绕y轴逆时针
                    }else{
                        direction = direction+0.4;//绕y轴顺时针
                    }
                    break;
                default:
                    break;
            }
            return direction;
        }
        //获取数组中的最小值
        function min(arr){
            var min = arr[0];
            var no = 0;
            for(var i=1;i<arr.length;i++){
                if(arr[i]<min){
                    min = arr[i];
                    no = i;
                }
            }
            return {no:no,value:min};
        }
        //是否存在重复值
        function isRepeat(arr){
            arr.sort(function(a,b){
                if(a<b){
                    return -1;
                }
                if(a>b){
                    return 1;
                }
                return 0;
            });
            for(var i=0;i<arr.length-1;i++){
                if(arr[i]==arr[i+1]){
                    return true;
                }
            }
            return false;
        }
        //开始操作魔方
        function startCube(event){
            getIntersects(event);
            //魔方没有处于转动过程中且存在碰撞物体
            if(!isRotating&&intersect){
                startPoint = intersect.point;//开始转动，设置起始点
                controller.enabled = false;//当刚开始的接触点在魔方上时操作为转动魔方，屏蔽控制器转动
            }else{
                controller.enabled = true;//当刚开始的接触点没有在魔方上或者在魔方上但是魔方正在转动时操作转动控制器
            }
        }
        //获取操作焦点以及该焦点所在平面的法向量
        function getIntersects(event){
            //触摸事件和鼠标事件获得坐标的方式有点区别
            if(event.touches){
                var touch = event.touches[0];
                mouse.x = (touch.clientX / width)*2 - 1;
                mouse.y = -(touch.clientY / height)*2 + 1;
            }else{
                mouse.x = (event.clientX / width)*2 - 1;
                mouse.y = -(event.clientY / height)*2 + 1;
            }
            raycaster.setFromCamera(mouse, camera);
            //Raycaster方式定位选取元素，可能会选取多个，以第一个为准
            var intersects = raycaster.intersectObjects(scene.children);
            if(intersects.length){
                try{
                    if(intersects[0].object.cubeType==='coverCube'){
                        intersect = intersects[1];
                        normalize = intersects[0].face.normal;
                    }else{
                        intersect = intersects[0];
                        normalize = intersects[1].face.normal;
                    }
                }catch(err){
                    //nothing
                }
            }
        }
    </script>
</body>
</html>

© 2018 GitHub, Inc.
Terms
Privacy
Security
Status
Help

Contact GitHub
API
Training
Shop
Blog
About

Press h to open a hovercard with more details.
