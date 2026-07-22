import kingdomMap from "../../../assets/map/fruit-kingdom-map.webp";
import type { Memory } from "../types";

export const mockMemories: Memory[] = [
  {
    id: "orchard-lantern",
    title: { en: "The Orchard Lantern", zh: "果园里的小灯笼" },
    description: {
      en: "Hailey found the warmest apple-red light and carried it carefully all afternoon.",
      zh: "Hailey 找到了一盏苹果红的小灯笼，小心翼翼地捧了整整一个下午。",
    },
    fruitKingdomStory: {
      en: "Apple King said every lantern glows brighter when someone uses it to guide a friend home.",
      zh: "苹果国王说，当我们用灯笼送朋友回家时，它就会变得更明亮。",
    },
    parentMessage: {
      en: "Today you noticed every tiny light along the path. I hope you always keep that wonderful curiosity.",
      zh: "今天你发现了小路上的每一束微光。希望你永远保留这份珍贵的好奇心。",
    },
    date: "2026-07-18",
    ageLabel: { en: "1 year 10 months", zh: "1 岁 10 个月" },
    regionId: "apple-forest",
    photo: kingdomMap,
    photoPosition: "18% 18%",
    photoScale: 1.48,
    author: "Dad",
  },
  {
    id: "castle-picnic",
    title: { en: "A Picnic at Strawberry Castle", zh: "草莓城堡野餐" },
    description: {
      en: "We shared tiny cakes while Hailey waved to every butterfly in the garden.",
      zh: "我们一起分享小蛋糕，Hailey 向花园里的每只蝴蝶挥手。",
    },
    fruitKingdomStory: {
      en: "Strawberry Princess unfolded a blanket that turned every crumb into a sparkling flower.",
      zh: "草莓公主铺开一张魔法毯，每一粒蛋糕屑都变成了闪亮的小花。",
    },
    parentMessage: {
      en: "Your happy little wave made everyone smile. May you always greet the world with such warmth.",
      zh: "你开心挥手的样子让每个人都笑了。愿你永远这样温暖地迎接世界。",
    },
    date: "2026-07-12",
    ageLabel: { en: "1 year 10 months", zh: "1 岁 10 个月" },
    regionId: "strawberry-castle",
    photo: kingdomMap,
    photoPosition: "62% 16%",
    photoScale: 1.52,
    author: "Mum",
  },
  {
    id: "lake-raft",
    title: { en: "Our Little Leaf Raft", zh: "我们的小叶子船" },
    description: {
      en: "Hailey watched the ripples and cheered when our leaf boat reached the little wooden bridge.",
      zh: "Hailey 看着水波，当叶子小船漂到木桥边时开心地拍起手来。",
    },
    fruitKingdomStory: {
      en: "Watermelon Giant whispered to the lake, asking the gentle current to carry our wishes safely.",
      zh: "西瓜巨人轻声对湖水说，请温柔的水流把我们的愿望安全送到远方。",
    },
    parentMessage: {
      en: "You were so patient waiting for the raft. Small wonders are always worth waiting for.",
      zh: "你耐心等待小船的样子真可爱。美好的小事情总是值得等待。",
    },
    date: "2026-07-05",
    ageLabel: { en: "1 year 9 months", zh: "1 岁 9 个月" },
    regionId: "watermelon-lake",
    photo: kingdomMap,
    photoPosition: "44% 44%",
    photoScale: 1.42,
    author: "Dad",
  },
  {
    id: "banana-sandcastle",
    title: { en: "The Wobbly Sandcastle", zh: "摇摇晃晃的沙堡" },
    description: {
      en: "Our castle fell down three times, and each time Hailey laughed and started building again.",
      zh: "我们的沙堡倒了三次，每一次 Hailey 都笑着重新开始。",
    },
    fruitKingdomStory: {
      en: "Banana Sheriff declared it the bravest castle on the beach because it never stopped trying.",
      zh: "香蕉警长说，这是海滩上最勇敢的城堡，因为它从来没有放弃。",
    },
    parentMessage: {
      en: "I loved watching you begin again without worrying. Keep that brave little heart.",
      zh: "我喜欢看你毫不担心地重新开始。愿你一直拥有这颗勇敢的小心脏。",
    },
    date: "2026-06-28",
    ageLabel: { en: "1 year 9 months", zh: "1 岁 9 个月" },
    regionId: "banana-beach",
    photo: kingdomMap,
    photoPosition: "12% 55%",
    photoScale: 1.5,
    author: "Mum",
  },
  {
    id: "grape-music",
    title: { en: "Music in Grape Valley", zh: "葡萄山谷的音乐" },
    description: {
      en: "The breeze moved through the vines and Hailey danced between the rows like a tiny purple ribbon.",
      zh: "微风穿过葡萄藤，Hailey 像一条紫色的小丝带在田间跳舞。",
    },
    fruitKingdomStory: {
      en: "Grape Wizard taught the vines a song that can only be heard by children dancing freely.",
      zh: "葡萄魔法师教会藤蔓一首歌，只有自由跳舞的孩子才能听见。",
    },
    parentMessage: {
      en: "Your dancing made an ordinary afternoon magical. Never be afraid to make your own music.",
      zh: "你的舞步让普通的下午变得充满魔法。永远不要害怕创造自己的音乐。",
    },
    date: "2026-06-20",
    ageLabel: { en: "1 year 9 months", zh: "1 岁 9 个月" },
    regionId: "grape-valley",
    photo: kingdomMap,
    photoPosition: "82% 28%",
    photoScale: 1.54,
    author: "Dad",
  },
  {
    id: "rainforest-rain",
    title: { en: "Rainforest Raindrops", zh: "雨林里的小雨滴" },
    description: {
      en: "We listened to rain tapping the leaves while Hailey counted every little waterfall.",
      zh: "我们听雨滴轻敲树叶，Hailey 数着一条条小瀑布。",
    },
    fruitKingdomStory: {
      en: "Kiwi Professor collected the rain in silver cups and found a tiny rainbow in every one.",
      zh: "奇异果博士用银色小杯收集雨水，在每一杯里都发现了一道小彩虹。",
    },
    parentMessage: {
      en: "Even on a rainy day, you found so many reasons to smile. You are our little sunshine.",
      zh: "即使是下雨天，你也找到了那么多微笑的理由。你是我们的小太阳。",
    },
    date: "2026-06-14",
    ageLabel: { en: "1 year 8 months", zh: "1 岁 8 个月" },
    regionId: "kiwi-rainforest",
    photo: kingdomMap,
    photoPosition: "30% 78%",
    photoScale: 1.5,
    author: "Mum",
  },
  {
    id: "volcano-cloud",
    title: { en: "The Cinnamon Cloud", zh: "肉桂味的云" },
    description: {
      en: "Hailey pointed at the volcano's soft cloud and tried to catch its warm cinnamon smell.",
      zh: "Hailey 指着火山上柔软的云，努力闻一闻那股温暖的肉桂香气。",
    },
    fruitKingdomStory: {
      en: "Orange Volcano Keeper puffed a cloud shaped like a sleepy bunny just for her.",
      zh: "橙子火山守护者特意为她吹出了一朵像睡觉小兔子的云。",
    },
    parentMessage: {
      en: "Your imagination makes every cloud into a new friend. Please keep dreaming big, little one.",
      zh: "你的想象力让每朵云都变成新朋友。小宝贝，请一直勇敢做梦。",
    },
    date: "2026-06-08",
    ageLabel: { en: "1 year 8 months", zh: "1 岁 8 个月" },
    regionId: "orange-volcano",
    photo: kingdomMap,
    photoPosition: "67% 73%",
    photoScale: 1.48,
    author: "Dad",
  },
  {
    id: "island-wishes",
    title: { en: "Wishes by the Coconut Sea", zh: "椰子海边的愿望" },
    description: {
      en: "We watched the evening water sparkle while Hailey tucked a tiny shell into her pocket.",
      zh: "我们看着傍晚的海面闪闪发光，Hailey 把一枚小贝壳放进口袋里。",
    },
    fruitKingdomStory: {
      en: "Coconut Captain promised the shell would remember the sea and sing whenever she missed it.",
      zh: "椰子船长说，小贝壳会记住大海，在她想念海浪时轻轻唱歌。",
    },
    parentMessage: {
      en: "I hope you collect a lifetime of small treasures and remember how loved you are.",
      zh: "愿你一生都能收藏许多小小宝物，也永远记得自己被深深爱着。",
    },
    date: "2026-06-01",
    ageLabel: { en: "1 year 8 months", zh: "1 岁 8 个月" },
    regionId: "coconut-island",
    photo: kingdomMap,
    photoPosition: "92% 77%",
    photoScale: 1.58,
    author: "Mum",
  },
];
