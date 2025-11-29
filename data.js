export const categories = [
    {
        id: "plasticizers",
        name: "增塑剂 (Plasticizers)",
        icon: "stretch-horizontal",
        description: "增加塑料的可塑性、流动性和柔韧性，降低脆性。",
        items: [
            {
                name: "DOP (邻苯二甲酸二辛酯)",
                type: "通用型",
                features: "综合性能好，混合性佳，效率高，挥发性低。",
                applications: "PVC电缆料、人造革、薄膜。",
                price: 12.5,
                stock: 500
            },
            {
                name: "DINP (邻苯二甲酸二异壬酯)",
                type: "通用型",
                features: "耐热性优于DOP，耐老化，低挥发。",
                applications: "玩具、耐高温电缆、汽车内饰。",
                price: 14.2,
                stock: 300
            },
            {
                name: "DOTP (对苯二甲酸二辛酯)",
                type: "环保型",
                features: "耐电性、耐寒性优良，无毒，符合环保标准。",
                applications: "医疗器械、食品包装、儿童玩具。",
                price: 16.8,
                stock: 200
            },
            {
                name: "DOA (己二酸二辛酯)",
                type: "耐寒型",
                features: "耐寒性极优，低温柔曲性好，电气性能佳。",
                applications: "耐寒电缆、冷冻设备密封件、农用薄膜。",
                price: 18.5,
                stock: 150
            },
            {
                name: "TOTM (偏苯三酸三辛酯)",
                type: "高性能环保型",
                features: "高度支化结构，耐高温，低挥发，通过FDA认证。",
                applications: "高端医用手套、血液袋、食品包装。",
                price: 25.0,
                stock: 100
            },
            {
                name: "ATBC (乙酰柠檬酸三丁酯)",
                type: "无毒增塑剂",
                features: "无毒，耐寒，耐光，水萃取率低。",
                applications: "儿童玩具、食品包装、医用制品。",
                price: 22.0,
                stock: 120
            },
            {
                name: "DBP (邻苯二甲酸二丁酯)",
                type: "通用型",
                features: "增塑效率高，成本低，但耐寒性和耐久性一般。",
                applications: "PVC糊树脂制品，胶粘剂，密封剂。",
                price: 10.8,
                stock: 400
            },
            {
                name: "DOS (己二酸二辛酯)",
                type: "耐寒型",
                features: "优异的耐寒性能，低温柔曲性好，电气绝缘性佳。",
                applications: "耐寒电缆，冷冻设备密封件，汽车部件。",
                price: 19.5,
                stock: 180
            },
            {
                name: "环己烷二甲酸二异壬酯 (DINCH)",
                type: "环保型",
                features: "高度支化结构，低挥发，优异的耐萃取性，生物相容性好。",
                applications: "医疗器械，食品包装，儿童用品。",
                price: 20.0,
                stock: 160
            }
        ]
    },
    {
        id: "flame_retardants",
        name: "阻燃剂 (Flame Retardants)",
        icon: "flame",
        description: "提高塑料的耐燃性，抑制火焰蔓延。",
        items: [
            {
                name: "十溴二苯乙烷 (DBDPE)",
                type: "卤系阻燃剂",
                features: "热稳定性极高，不泛黄，无二恶英风险。",
                applications: "ABS, HIPS, PP, PBT等工程塑料。",
                price: 35.0,
                stock: 200
            },
            {
                name: "聚磷酸铵 (APP)",
                type: "磷系阻燃剂",
                features: "膨胀型阻燃，低烟，无毒。",
                applications: "PP, PE, 防火涂料。",
                price: 28.0,
                stock: 300
            },
            {
                name: "氢氧化镁 (Mg(OH)2)",
                type: "无机填充型",
                features: "无毒、无卤、抑烟，兼具填充作用。",
                applications: "PE, PP, EVA电缆料。",
                price: 8.5,
                stock: 1000
            },
            {
                name: "三氧化二锑 (Antimony Trioxide)",
                type: "协效阻燃剂",
                features: "与卤系阻燃剂有极好的协同效应，增强阻燃效果。",
                applications: "与卤系阻燃剂配合使用于各种塑料。",
                price: 42.0,
                stock: 150
            },
            {
                name: "硼酸锌 (Zinc Borate)",
                type: "无卤阻燃剂",
                features: "无卤无毒，抑烟效果好，可作填料使用。",
                applications: "电线电缆、建筑材料、纺织品。",
                price: 32.0,
                stock: 250
            },
            {
                name: "磷酸三(2-氯丙基)酯 (TCPP)",
                type: "氯化石蜡类",
                features: "阻燃增塑双重功能，粘度低，相容性好。",
                applications: "聚氨酯泡沫、PVC电缆料、橡胶。",
                price: 22.5,
                stock: 180
            },
            {
                name: "氢氧化铝 (ATH, Al(OH)3)",
                type: "无机填充型",
                features: "无毒，抑烟，不燃，兼具填充作用，分解吸热。",
                applications: "电线电缆，建筑材料，运输工具内饰。",
                price: 6.8,
                stock: 1200
            },
            {
                name: "红磷 (Red Phosphorus)",
                type: "磷系阻燃剂",
                features: "阻燃效率极高，抑烟效果好，但易氧化变色。",
                applications: "PA, PET, PBT等工程塑料。",
                price: 38.0,
                stock: 200
            },
            {
                name: "三聚氰胺氰尿酸盐 (MCA)",
                type: "氮系阻燃剂",
                features: "无卤无磷，热稳定性好，不冒烟，对力学性能影响小。",
                applications: "PA, PU, 环氧树脂。",
                price: 45.0,
                stock: 120
            }
        ]
    },
    {
        id: "antioxidants",
        name: "抗氧剂 (Antioxidants)",
        icon: "shield-check",
        description: "延缓或抑制塑料在加工和使用过程中的氧化降解。",
        items: [
            {
                name: "抗氧剂 1010",
                type: "受阻酚类 (主抗氧剂)",
                features: "抗抽出性强，无色，无污，耐热性好。",
                applications: "PP, PE, PBT, ABS。",
                price: 65.0,
                stock: 100
            },
            {
                name: "抗氧剂 BHT (264)",
                type: "酚类抗氧剂",
                features: "通用型酚类抗氧剂，成本低，但易变色。",
                applications: "通用塑料，橡胶，润滑油。",
                price: 25.0,
                stock: 200
            },
            {
                name: "抗氧剂 3114",
                type: "复合型抗氧剂",
                features: "受阻酚与亚磷酸酯复合，长效抗氧化，加工稳定性好。",
                applications: "聚烯烃，特别是用于高温加工和长期使用的制品。",
                price: 75.0,
                stock: 80
            },
            {
                name: "抗氧剂 2246",
                type: "受阻酚类",
                features: "高效主抗氧剂，耐热性极佳，不污染制品。",
                applications: "PP, HDPE管道，汽车部件，电线电缆料。",
                price: 58.0,
                stock: 90
            },
            {
                name: "抗氧剂 626",
                type: "复合型抗氧剂",
                features: "主辅抗氧剂复合，加工稳定性和长期热稳定性优异。",
                applications: "聚烯烃，特别是用于高温加工场合。",
                price: 70.0,
                stock: 85
            },
            {
                name: "抗氧剂 1076",
                type: "受阻酚类",
                features: "挥发性低，耐洗涤性好，与聚合物相容性佳。",
                applications: "纤维级聚丙烯，薄膜，注塑制品。",
                price: 62.0,
                stock: 110
            },
            {
                name: "抗氧剂 168",
                type: "亚磷酸酯类 (辅抗氧剂)",
                features: "分解氢过氧化物，协同效应显著。",
                applications: "常与1010按1:1或1:2复配使用。",
                price: 55.0,
                stock: 120
            }
        ]
    },
    {
        id: "fillers",
        name: "填充增强剂 (Fillers/Reinforcements)",
        icon: "layers",
        description: "降低成本或提高刚性、强度、耐热性。",
        items: [
            {
                name: "玻璃纤维 (GF)",
                type: "增强材料",
                features: "大幅提高拉伸强度、弯曲模量和热变形温度。",
                applications: "PA66, PBT, PP, PC。",
                price: 8.0,
                stock: 500
            },
            {
                name: "滑石粉 (Talc)",
                type: "无机填料",
                features: "提高刚性，尺寸稳定性，成核作用。",
                applications: "PP汽车保险杠、内饰件。",
                price: 3.5,
                stock: 800
            },
            {
                name: "碳酸钙 (CaCO3)",
                type: "无机填料",
                features: "降低成本，增重，改善尺寸稳定性。",
                applications: "PVC管材，PE薄膜，PP注塑。",
                price: 2.2,
                stock: 1000
            },
            {
                name: "云母粉 (Mica Powder)",
                type: "天然矿物填料",
                features: "片状结构，提高刚性和耐热性，改善制品外观。",
                applications: "PP汽车部件，电器绝缘件，涂料。",
                price: 4.8,
                stock: 600
            },
            {
                name: "硅灰石 (Wollastonite)",
                type: "针状填料",
                features: "高长径比，提高拉伸强度和弯曲强度，改善流动性。",
                applications: "工程塑料，建筑陶瓷，摩擦材料。",
                price: 6.5,
                stock: 400
            },
            {
                name: "硫酸钡 (Barium Sulfate)",
                type: "惰性填料",
                features: "高密度，化学惰性，不溶于水和有机溶剂。",
                applications: "蓄电池外壳，医用制品，高档涂料。",
                price: 5.2,
                stock: 350
            },
            {
                name: "碳纤维 (Carbon Fiber)",
                type: "高强度增强材料",
                features: "高强度，高模量，轻质，导电，耐高温。",
                applications: "航空航天，汽车轻量化，体育器材，电子设备外壳。",
                price: 120.0,
                stock: 50
            },
            {
                name: "纳米碳酸钙",
                type: "纳米填料",
                features: "粒径小，比表面积大，补强效果好，改善表面光洁度。",
                applications: "高档涂料，橡胶制品，塑料薄膜。",
                price: 12.0,
                stock: 200
            },
            {
                name: "蒙脱土 (有机改性)",
                type: "纳米层状填料",
                features: "纳米级分散，提高阻隔性，增强力学性能，阻燃效果。",
                applications: "尼龙纳米复合材料，包装材料，阻燃材料。",
                price: 18.0,
                stock: 150
            }
        ]
    },
    {
        id: "modifiers",
        name: "抗冲改性剂 (Impact Modifiers)",
        icon: "hammer",
        description: "提高脆性塑料的韧性和抗冲击性能。",
        items: [
            {
                name: "CPE (氯化聚乙烯)",
                type: "弹性体",
                features: "耐候性好，价格低廉，网络互穿增韧。",
                applications: "PVC型材、管材。",
                price: 15.0,
                stock: 300
            },
            {
                name: "MBS",
                type: "核壳结构",
                features: "保持透明度，增韧效果好，但不耐候。",
                applications: "透明PVC片材，薄膜。",
                price: 28.0,
                stock: 150
            },
            {
                name: "POE (聚烯烃弹性体)",
                type: "弹性体",
                features: "与PP相容性好，低温韧性优异。",
                applications: "PP汽车保险杠。",
                price: 22.0,
                stock: 200
            },
            {
                name: "ACR (丙烯酸酯类共聚物)",
                type: "核壳结构",
                features: "加工助剂兼抗冲改性剂，提高熔体强度和韧性。",
                applications: "PVC型材、管材、片材。",
                price: 32.0,
                stock: 180
            },
            {
                name: "EVA (乙烯-醋酸乙烯共聚物)",
                type: "弹性体",
                features: "柔韧性好，粘接性强，透明性高。",
                applications: "PVC电缆料，薄膜，发泡材料。",
                price: 18.0,
                stock: 250
            },
            {
                name: "TPU (热塑性聚氨酯)",
                type: "热塑性弹性体",
                features: "高强度，高韧性，耐磨，耐油。",
                applications: "工程塑料合金，弹性体部件。",
                price: 45.0,
                stock: 120
            },
            {
                name: "SBS (苯乙烯-丁二烯-苯乙烯嵌段共聚物)",
                type: "热塑性弹性体",
                features: "优异的韧性，良好的透明度，加工性能好。",
                applications: "PP, PS, ABS增韧改性，胶粘剂，沥青改性。",
                price: 20.0,
                stock: 220
            },
            {
                name: "SEBS (氢化SBS)",
                type: "热塑性弹性体",
                features: "优异的耐候性，耐热性，透明度高，压缩永久变形小。",
                applications: "高档玩具，医疗器械，食品包装，汽车部件。",
                price: 38.0,
                stock: 140
            },
            {
                name: "核壳型抗冲改性剂 (MABS)",
                type: "核壳结构",
                features: "保持高透明度的同时提供优异的抗冲击性能。",
                applications: "透明PVC，PC，PMMA制品。",
                price: 35.0,
                stock: 130
            }
        ]
    },
    {
        id: "light_stabilizers",
        name: "光稳定剂 (Light Stabilizers)",
        icon: "sun",
        description: "防止塑料因紫外线照射而老化、变色或脆化。",
        items: [
            {
                name: "UV-531",
                type: "二苯甲酮类",
                features: "吸收240-340nm紫外线，相容性好。",
                applications: "PE, PVC, PP。",
                price: 55.0,
                stock: 100
            },
            {
                name: "HALS 770",
                type: "受阻胺类",
                features: "捕获自由基，长效保护，表面光泽保持好。",
                applications: "PP, PE, ABS, PU。",
                price: 85.0,
                stock: 80
            },
            {
                name: "UV-326",
                type: "苯并三唑类",
                features: "紫外吸收能力强，与多种树脂相容性好，高效持久。",
                applications: "聚烯烃户外制品，汽车部件，农业薄膜。",
                price: 75.0,
                stock: 90
            },
            {
                name: "UV-9",
                type: "二苯甲酮类",
                features: "成本较低，适用于多种塑料，但耐光性一般。",
                applications: "室内制品，短期户外使用制品。",
                price: 45.0,
                stock: 120
            },
            {
                name: "HALS 944",
                type: "高分子量受阻胺类",
                features: "分子量高，不易挥发和抽出，长效防护。",
                applications: "长效户外制品，汽车外饰件。",
                price: 95.0,
                stock: 70
            },
            {
                name: "UV-3808",
                type: "苯并三唑类",
                features: "超高分子量，极低挥发性，长效防护，与聚合物相容性好。",
                applications: "汽车外饰件，户外建材，农业薄膜。",
                price: 120.0,
                stock: 60
            },
            {
                name: "HALS 783",
                type: "液体受阻胺类",
                features: "液体形式，易于混合，长效光稳定效果，与多种聚合物兼容。",
                applications: "聚烯烃，弹性体，涂料，胶粘剂。",
                price: 90.0,
                stock: 75
            },
            {
                name: "HALS 622",
                type: "聚合型受阻胺类",
                features: "分子量高，不易挥发和抽出，长效防护，耐高温。",
                applications: "长效户外制品，汽车外饰件，农业薄膜。",
                price: 88.0,
                stock: 85
            }
        ]
    },
    {
        id: "colorants",
        name: "着色剂 (Colorants)",
        icon: "palette",
        description: "赋予塑料制品各种颜色，提高产品的美观性和识别性。",
        items: [
            {
                name: "酞菁蓝 (Phthalocyanine Blue)",
                type: "有机颜料",
                features: "色彩鲜艳，着色力强，耐光耐候性优异，化学稳定性好。",
                applications: "广泛用于PE、PP、PVC、PS等各种塑料制品着色。",
                price: 120.0,
                stock: 50
            },
            {
                name: "钛白粉 (Titanium Dioxide)",
                type: "无机颜料",
                features: "遮盖力强，白度高，耐候性好，化学稳定性优异。",
                applications: "适用于所有需要白色或浅色的塑料制品。",
                price: 25.0,
                stock: 200
            },
            {
                name: "炭黑 (Carbon Black)",
                type: "无机颜料",
                features: "黑度高，着色力强，导电性好，耐候性优异。",
                applications: "黑色塑料制品，抗静电制品，导电制品。",
                price: 18.0,
                stock: 300
            },
            {
                name: "永固紫 RL (Permanent Violet RL)",
                type: "有机颜料",
                features: "鲜艳的紫色，优异的耐光耐候性，高着色力。",
                applications: "塑料制品着色，特别是需要鲜艳紫色的场合。",
                price: 150.0,
                stock: 40
            },
            {
                name: "氧化铁红 (Iron Oxide Red)",
                type: "无机颜料",
                features: "色彩稳定，耐光耐候性优异，成本低，遮盖力强。",
                applications: "建筑材料，塑料制品，涂料，陶瓷。",
                price: 12.0,
                stock: 400
            },
            {
                name: "荧光增白剂 (Fluorescent Whitening Agents)",
                type: "光学增白剂",
                features: "吸收紫外光发出蓝光，补偿基材泛黄，提高白度和亮度。",
                applications: "PP, PE, PS等聚烯烃制品增白。",
                price: 35.0,
                stock: 150
            }
        ]
    },
    {
        id: "lubricants",
        name: "润滑剂 (Lubricants)",
        icon: "droplets",
        description: "改善塑料加工流动性，减少摩擦，提高制品表面光洁度。",
        items: [
            {
                name: "硬脂酸锌 (Zinc Stearate)",
                type: "金属皂类",
                features: "内润滑性好，热稳定性高，兼具脱模作用。",
                applications: "PVC制品，橡胶制品，化妆品添加剂。",
                price: 18.0,
                stock: 250
            },
            {
                name: "PE蜡 (Polyethylene Wax)",
                type: "聚合物蜡",
                features: "外润滑效果好，提高表面光泽，改善分散性。",
                applications: "色母粒、PVC、橡胶加工助剂。",
                price: 22.0,
                stock: 200
            },
            {
                name: "芥酸酰胺 (Erucamide)",
                type: "酰胺类",
                features: "爽滑性优异，抗粘连，开口性好，迁移速度快。",
                applications: "薄膜制品，包装材料，提高表面爽滑性。",
                price: 35.0,
                stock: 150
            },
            {
                name: "硬脂酸钙 (Calcium Stearate)",
                type: "金属皂类",
                features: "热稳定性好，兼具润滑和稳定双重功能，价格低廉。",
                applications: "PVC制品，特别是硬质PVC，作为稳定剂使用。",
                price: 15.0,
                stock: 300
            },
            {
                name: "石蜡 (Paraffin Wax)",
                type: "矿物蜡",
                features: "外润滑效果好，成本低，但耐热性一般。",
                applications: "通用塑料加工，特别是PVC制品。",
                price: 8.0,
                stock: 500
            },
            {
                name: "油酸酰胺 (Oleamide)",
                type: "酰胺类",
                features: "爽滑性和抗粘连性优异，开口性好，迁移速度快。",
                applications: "薄膜制品，包装材料，提高表面爽滑性。",
                price: 32.0,
                stock: 160
            }
        ]
    },
    {
        id: "foaming_agents",
        name: "发泡剂 (Foaming Agents)",
        icon: "cloud",
        description: "在塑料加工过程中产生气体，形成微孔结构，降低密度。",
        items: [
            {
                name: "AC发泡剂 (偶氮二甲酰胺)",
                type: "化学发泡剂",
                features: "发气量大，发泡均匀，分解温度适中。",
                applications: "EVA鞋底、PVC人造革、保温材料。",
                price: 28.0,
                stock: 150
            },
            {
                name: "碳酸氢钠 (Sodium Bicarbonate)",
                type: "无机发泡剂",
                features: "分解温度低，无毒，成本低廉，发气量较小。",
                applications: "低密度PE泡沫制品，缓冲包装材料。",
                price: 5.0,
                stock: 500
            },
            {
                name: "H发泡剂 (对甲苯磺酰肼)",
                type: "化学发泡剂",
                features: "分解温度低，发气量大，适用于低温发泡工艺。",
                applications: "软质PVC，橡胶制品，低密度发泡材料。",
                price: 32.0,
                stock: 120
            },
            {
                name: "物理发泡剂 (丁烷、戊烷等)",
                type: "物理发泡剂",
                features: "环保，发泡倍率高，泡孔结构均匀，成本低。",
                applications: "PS, PE, PP泡沫制品，特别是挤出发泡工艺。",
                price: 12.0,
                stock: 300
            },
            {
                name: "Exothermic Foaming Agent (放热型发泡剂)",
                type: "复合化学发泡剂",
                features: "发泡过程中放热，有助于发泡和固化，泡孔细腻均匀。",
                applications: "注塑发泡制品，特别是厚壁制品。",
                price: 38.0,
                stock: 100
            }
        ]
    },
    {
        id: "antimicrobial_agents",
        name: "抗菌剂 (Antimicrobial Agents)",
        icon: "microscope",
        description: "抑制细菌、霉菌等微生物生长，延长制品使用寿命。",
        items: [
            {
                name: "银离子抗菌剂",
                type: "无机抗菌剂",
                features: "广谱抗菌，持久性好，安全性高，耐热性强。",
                applications: "医疗器械、食品包装、家电外壳。",
                price: 85.0,
                stock: 80
            },
            {
                name: "季铵盐类抗菌剂",
                type: "有机抗菌剂",
                features: "杀菌速度快，对革兰氏阳性菌效果好，易加工。",
                applications: "PVC地板、壁纸、纺织品后整理。",
                price: 45.0,
                stock: 120
            },
            {
                name: "沸石载银抗菌剂",
                type: "载银抗菌剂",
                features: "缓释抗菌，持久性好，安全性高，耐热性强。",
                applications: "洗衣机内筒，空调换热器，饮水机管道。",
                price: 75.0,
                stock: 90
            },
            {
                name: "氧化锌 (Zinc Oxide)",
                type: "无机抗菌剂",
                features: "广谱抗菌，紫外线屏蔽，与多种聚合物相容性好。",
                applications: "纤维，薄膜，涂料，橡胶制品。",
                price: 22.0,
                stock: 200
            },
            {
                name: "异噻唑啉酮类抗菌剂",
                type: "有机抗菌剂",
                features: "杀菌速度快，广谱抗菌，易加工，但可能影响透明度。",
                applications: "PVC制品，涂料，胶粘剂，水处理。",
                price: 38.0,
                stock: 150
            }
        ]
    },
    {
        id: "antistatic_agents",
        name: "抗静电剂 (Antistatic Agents)",
        icon: "zap-off",
        description: "消除或防止塑料表面静电积聚，避免吸附灰尘和电击。",
        items: [
            {
                name: "乙氧基化脂肪胺",
                type: "阳离子型",
                features: "抗静电效果快，但耐久性一般，易吸湿。",
                applications: "PVC薄膜、包装材料、电子器件包装。",
                price: 42.0,
                stock: 100
            },
            {
                name: "乙氧基化脂肪酸酯",
                type: "非离子型",
                features: "抗静电效果持久，耐热性好，与其他助剂相容性好。",
                applications: "PP、PE薄膜，电子电器外壳。",
                price: 38.0,
                stock: 120
            },
            {
                name: "甘油酯类抗静电剂",
                type: "非离子型",
                features: "抗静电效果持久，耐热性好，与多种聚合物相容性好。",
                applications: "PP、PE薄膜，电子电器外壳，包装材料。",
                price: 35.0,
                stock: 130
            },
            {
                name: "磷酸酯类抗静电剂",
                type: "阴离子型",
                features: "抗静电效果快，热稳定性好，与其他助剂相容性好。",
                applications: "PVC制品，橡胶制品，涂料。",
                price: 32.0,
                stock: 140
            },
            {
                name: "永久性抗静电剂 (导电聚合物)",
                type: "永久型",
                features: "永久抗静电效果，不迁移，不影响制品外观。",
                applications: "电子器件外壳，洁净室用品，包装材料。",
                price: 95.0,
                stock: 60
            }
        ]
    }
];

// 导出一个函数，用于根据原材料名称获取其价格和库存信息
export function getMaterialInfoByName(name) {
    // 遍历所有类别查找匹配的原材料
    for (const category of categories) {
        const material = category.items.find(item => item.name === name);
        if (material) {
            return {
                price: material.price || 0,
                stock: material.stock || 0
            };
        }
    }
    // 如果未找到匹配的原材料，返回默认值
    return {
        price: 0,
        stock: 0
    };
}

// 基材价格和库存信息映射
export const baseMaterialInfo = {
    "PBT": {
        price: 25.0,
        stock: 1000
    },
    "PET": {
        price: 22.0,
        stock: 800
    },
    "PA66": {
        price: 32.0,
        stock: 600
    },
    "PA6": {
        price: 28.0,
        stock: 700
    }
};
