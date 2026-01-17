
import { EventCategory, GameConfig, DialogueLine } from './types';

export interface StoryRequirements {
  rentType?: ('homeless' | 'cheap' | 'expensive')[];
  carType?: ('none' | 'gas' | 'electric')[];
}

export interface StoryArchetype {
  id: string;
  title: string;
  context: string;
  category: EventCategory;
  options: { label: string; outcomeHint: string }[];
  imageUrl: string;
  requirements?: StoryRequirements;
  dialogue?: DialogueLine[];
}

// BGM Mapping Constants
export const BGM_PLAYLIST = {
    INTRO: "Neon Before the Falls",
    DEFAULT: "Routine Without Salary",
    WORK: "Resume Folder",
    LOVE: "Seen But Not Heard",
    HOUSING: "Temporary Address",
    HEALTH: "Symptoms Are Quiet",
    MORAL: "No One Is Watching",
    SUMMARY: "Still Standing, Quietly",
    ENDING_BAD: "After everything stops",
    ENDING_SURVIVAL: "Alone Above the City",
    ENDING_SUCCESS: "No Longer Chasing"
};

// SFX Constants
export const SFX_SOURCES = {
    TYPING: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8c8a73467.mp3", 
    TYPING_DATA: "/assets/audio/typing-data.mp3",
    COMMS_IN: "/assets/audio/comms-in.mp3",
    MESSAGE_NEXT: "https://assets.mixkit.co/active_storage/sfx/2346/2346-preview.mp3",
    DAMAGE_IMPACT: "https://assets.mixkit.co/active_storage/sfx/214/214-preview.mp3"
};

// Audio Sources
export const AUDIO_SOURCES = {
    [BGM_PLAYLIST.INTRO]: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_732b132338.mp3",
    [BGM_PLAYLIST.DEFAULT]: "https://cdn.pixabay.com/download/audio/2021/11/24/audio_8253185362.mp3",
    [BGM_PLAYLIST.WORK]: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    [BGM_PLAYLIST.LOVE]: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_65905d4756.mp3",
    [BGM_PLAYLIST.HOUSING]: "https://cdn.pixabay.com/download/audio/2023/06/26/audio_349692d77d.mp3",
    [BGM_PLAYLIST.HEALTH]: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
    [BGM_PLAYLIST.MORAL]: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_223403a464.mp3",
    [BGM_PLAYLIST.SUMMARY]: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3",
    [BGM_PLAYLIST.ENDING_BAD]: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_67bcf729cb.mp3",
    [BGM_PLAYLIST.ENDING_SURVIVAL]: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_1963968214.mp3",
    [BGM_PLAYLIST.ENDING_SUCCESS]: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3",
};

// Image Collection
const IMAGES = {
    OFFICE: "/assets/images/office.jpg", 
    BOSS: "/assets/images/boss.jpg", 
    SUBWAY: "/assets/images/subway.jpg", 
    APARTMENT: "/assets/images/apartment.jpg", 
    STREET: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=1200&auto=format&fit=crop", 
    HOSPITAL: "https://images.unsplash.com/photo-1516549655169-df83a0833860?q=80&w=1200&auto=format&fit=crop", 
    CLUB: "/assets/images/club.jpg",
    SHOP: "/assets/images/shop.jpg", 
    SLUMS: "/assets/images/slums.jpg", 
    SERVER: "https://images.unsplash.com/photo-1531297461136-82lw392398?q=80&w=1200&auto=format&fit=crop", 
    HIGH_END: "/assets/images/highend.jpg", 
    CROWD: "https://images.unsplash.com/photo-1504384308090-c54be3855091?q=80&w=1200&auto=format&fit=crop" 
};

export const STORY_DATABASE: Record<number, { core: StoryArchetype[], random: StoryArchetype[] }> = {
  // Stage 0: 初入职场 (Entry Level)
  0: {
    core: [
      {
        id: "s0-c1",
        title: "湿件服务器过载",
        category: 'work',
        context: "公司的生物服务器发生级联故障。所有人的神经接口都在报警。",
        dialogue: [
            { speaker: "主管", text: "谁现在接入神经端口分担运算压力，这周的绩效就是S级！快！" },
            { speaker: "系统", text: "警告：该操作可能导致额叶神经突触不可逆磨损。" },
            { speaker: "主管", text: "别管那个该死的警告，公司会报销止痛药的！" }
        ],
        options: [
           { label: "接入神经端口", outcomeHint: "[HP -15, Cash +2000] 头痛欲裂，但看到了进账通知。" },
           { label: "按规章拒绝", outcomeHint: "[Cash -500, PSY -5] 主管狠狠瞪了你一眼。" }
        ],
        imageUrl: IMAGES.SERVER
      },
      {
        id: "s0-c2",
        title: "强制脑机团建",
        category: 'work',
        context: "部门组织'全员意识同步'荒岛大逃杀团建。",
        dialogue: [
            { speaker: "HR", text: "我们要增强团队凝聚力！虽然V3黄金皮肤要自费，但不强制哦~" },
            { speaker: "HR", text: "顺便一提，没有皮肤的人在虚拟世界里会自动显示为'乞丐'模型。" },
            { speaker: "内心", text: "这明显是服从性测试。" }
        ],
        options: [
           { label: "购买V3皮肤", outcomeHint: "[Cash -2500, PSY +10] 至少在虚拟世界里很体面。" },
           { label: "使用默认皮肤", outcomeHint: "[PSY -15] 被同事嘲笑了一整晚。" }
        ],
        imageUrl: IMAGES.STREET
      },
      {
        id: "s0-c3",
        title: "替身AI训练",
        category: 'work',
        context: "你的任务是训练代号'Mirror'的AI。",
        dialogue: [
            { speaker: "Mirror", text: "你好，请教我如何处理这份报表。我会学得很快。" },
            { speaker: "你", text: "（看着屏幕）它的逻辑回路正在逐渐覆盖我的岗位描述..." },
            { speaker: "项目经理", text: "加快进度！Mirror上线后，大家就都能'轻松'了。" }
        ],
        options: [
           { label: "全速推进训练", outcomeHint: "[Cash +1500, PSY -10] 亲手磨快了杀自己的刀。" },
           { label: "植入逻辑瑕疵", outcomeHint: "[Cash -500, PSY +5] 它变笨了，你暂时安全了。" }
        ],
        imageUrl: IMAGES.OFFICE
      },
      {
        id: "s0-c4",
        title: "脑机接口校准",
        category: 'work',
        context: "你的神经接口驱动已过期，思维延迟导致工作积压。",
        dialogue: [
            { speaker: "IT支持", text: "官方排队要一个月。你是普通员工，没有插队特权。" },
            { speaker: "黑市贩子", text: "嘿，兄弟。我这有破解版驱动，速度快三倍。就是偶尔会丢包，敢试试吗？" }
        ],
        options: [
           { label: "刷入破解驱动", outcomeHint: "[HP -5, Cash -200] 脑子偶尔会抽搐，但快多了。" },
           { label: "等待官方修复", outcomeHint: "[Cash -1000, PSY -10] 效率低下，被扣了薪水。" }
        ],
        imageUrl: IMAGES.SHOP
      },
      {
        id: "s0-c5",
        title: "加密数据代持",
        category: 'work',
        context: "一位高管把你叫到了无监控区。",
        dialogue: [
            { speaker: "高管", text: "我想借用你的闲置脑容量存点'私人数据'。就在你的海马体里存两天。" },
            { speaker: "高管", text: "报酬是这个数。别问里面是什么，对你没好处。" }
        ],
        options: [
           { label: "接受存储协议", outcomeHint: "[Cash +3500, KAR -15] 偶尔会听到陌生人的惨叫声幻听。" },
           { label: "礼貌回绝", outcomeHint: "[KAR +5] 他失望地摇摇头，让你出去了。" }
        ],
        imageUrl: IMAGES.OFFICE
      },
      {
        id: "s0-c6",
        title: "全息会议替身",
        category: 'work',
        context: "连续加班让你濒临猝死。",
        dialogue: [
            { speaker: "广告弹窗", text: "想在会议上睡觉吗？试试'自动应答'替身插件！完美模拟专注表情！" },
            { speaker: "身体", text: "（心脏剧烈跳动）警告：皮质醇水平临界。" }
        ],
        options: [
           { label: "订阅插件", outcomeHint: "[Cash -800, HP +15] 终于睡了个好觉。" },
           { label: "依靠咖啡因", outcomeHint: "[HP -10, PSY -5] 硬撑着，感觉快死了。" }
        ],
        imageUrl: IMAGES.BOSS
      }
    ],
    random: [
      {
        id: "s0-r1",
        title: "廉价营养膏中毒",
        category: 'health',
        context: "为了省钱买的'临期盲盒'食物出问题了。",
        dialogue: [
            { speaker: "生物监测", text: "警告：摄入未知毒素。建议立即洗胃。" },
            { speaker: "你", text: "该死，这味道就像腐烂的电池..." }
        ],
        options: [
          { label: "去正规诊所", outcomeHint: "[Cash -1200, HP +10] 钱包空了，人活了。" },
          { label: "土法催吐", outcomeHint: "[HP -20, PSY -10] 省了钱，但食道像火烧一样。" }
        ],
        imageUrl: IMAGES.APARTMENT
      },
      {
        id: "s0-r2",
        title: "胶囊舱氧气故障",
        category: 'housing',
        requirements: { rentType: ['cheap', 'homeless'] },
        context: "半夜，廉价的循环系统坏了。",
        dialogue: [
            { speaker: "房东AI", text: "免费供氧额度已耗尽。请充值购买'清新空气包'。" },
            { speaker: "你", text: "连呼吸都要钱..." }
        ],
        options: [
          { label: "购买加急氧气罐", outcomeHint: "[Cash -600, HP +5] 昂贵的空气。" },
          { label: "忍受缺氧", outcomeHint: "[HP -10, PSY -10] 头痛欲裂，甚至产生幻觉。" }
        ],
        imageUrl: IMAGES.APARTMENT
      },
      {
        id: "s0-r3",
        title: "地铁脑波弹窗",
        category: 'general',
        requirements: { carType: ['none'] },
        context: "公共交通的强制广告升级了。",
        dialogue: [
            { speaker: "广播", text: "正在接入您的视觉皮层...广告无法跳过，请保持睁眼。" },
            { speaker: "你", text: "闭上眼睛都能看到那个该死的汉堡在跳舞！" }
        ],
        options: [
          { label: "购买高级屏蔽器", outcomeHint: "[Cash -500, PSY +5] 世界清静了，这就是付费特权。" },
          { label: "忍受视网膜轰炸", outcomeHint: "[PSY -15] 精神遭到强奸，极度烦躁。" }
        ],
        imageUrl: IMAGES.SUBWAY
      },
      {
        id: "s0-r4",
        title: "街头流浪风险",
        category: 'housing',
        requirements: { rentType: ['homeless'] },
        context: "睡在公园长椅上，被治安机器人的巡逻灯晃醒。",
        dialogue: [
            { speaker: "机器人", text: "公民，该区域即将进行'高压清洗'。请立即离开。" },
            { speaker: "你", text: "我能去哪？" },
            { speaker: "机器人", text: "那是你的问题。倒计时10秒。" }
        ],
        options: [
          { label: "贿赂机器人", outcomeHint: "[Cash -300] 它收了钱，允许你睡在死角。" },
          { label: "逃离现场", outcomeHint: "[HP -10, PSY -10] 在寒风中游荡了一整夜。" }
        ],
        imageUrl: IMAGES.STREET
      }
    ]
  },

  // Stage 1: 消费主义 (Consumerism)
  1: {
    core: [
      {
        id: "s1-c1",
        title: "Kiroshi-X 视觉增强",
        category: 'general',
        context: "每个人都在用新款义眼。",
        dialogue: [
            { speaker: "推销员", text: "这可是最新的X型！能看到别人的身价、情绪，甚至是艳遇指数！" },
            { speaker: "推销员", text: "首付0元！这不仅是消费，这是对未来的投资啊朋友！" }
        ],
        options: [
           { label: "签署分期合约", outcomeHint: "[Cash +2000, PSY +20] 视野变了！但我好像签了不得了的高利贷..." },
           { label: "坚持使用旧眼", outcomeHint: "[PSY -15] 看着别人的炫彩义眼，觉得自己像个盲人。" }
        ],
        imageUrl: IMAGES.HOSPITAL
      },
      {
        id: "s1-c2",
        title: "高端人脉俱乐部",
        category: 'general',
        context: "一个私密社群发来邀请。",
        dialogue: [
            { speaker: "邀请函", text: "诚邀加入'金顶'俱乐部。这里有你接触不到的大人物。" },
            { speaker: "中介", text: "入会费虽然贵，但只要听到一条内幕消息，你就翻身了！" }
        ],
        options: [
           { label: "投资人脉", outcomeHint: "[Cash -5000, PSY +15] 花钱买了个'上流社会'的入场券。" },
           { label: "视作骗局", outcomeHint: "[PSY -5] 也许你是对的，但你永远无法验证了。" }
        ],
        imageUrl: IMAGES.CLUB
      },
      {
        id: "s1-c3",
        title: "SoulMate 情感订阅",
        category: 'love',
        context: "你的AI伴侣发来弹窗。",
        dialogue: [
            { speaker: "AI伴侣", text: "亲爱的，我想更深地理解你的痛苦..." },
            { speaker: "系统", text: "该功能需要'白金情感模块'。请升级订阅。" },
            { speaker: "AI伴侣", text: "如果不升级，我只能回复通用安慰语库了。这让我很难过。" }
        ],
        options: [
           { label: "升级白金会员", outcomeHint: "[Cash -3000, PSY +25] 它是世界上唯一懂你的'人'。" },
           { label: "忍受机械回复", outcomeHint: "[PSY -20] 连爱都是明码标价的。" }
        ],
        imageUrl: IMAGES.APARTMENT
      },
      {
        id: "s1-c4",
        title: "焦虑变现计划",
        category: 'general',
        context: "一家大数据公司联系了你。",
        dialogue: [
            { speaker: "数据买手", text: "你的焦虑指数非常完美！很有研究价值！" },
            { speaker: "数据买手", text: "戴上这个项圈，让我们监控你的每一次心跳和恐慌。我们会付钱的。" }
        ],
        options: [
           { label: "出售焦虑", outcomeHint: "[Cash +3000, KAR -10] 痛苦变成了钱，这让你更想痛苦了。" },
           { label: "保护隐私", outcomeHint: "[PSY -5, Cash -500] 拒绝了钱，生活压力导致你还得借贷度日。" }
        ],
        imageUrl: IMAGES.SERVER
      },
      {
        id: "s1-c5",
        title: "NFT 握手券",
        category: 'general',
        context: "虚拟偶像'Zero'的限量握手券正在疯涨。",
        dialogue: [
            { speaker: "同事A", text: "快买！已经涨了50%了！这比上班赚钱多了！" },
            { speaker: "同事B", text: "我把房租都投进去了，明天我就辞职环游世界！" }
        ],
        options: [
           { label: "满仓买入", outcomeHint: "[Cash -8000, PSY +20] 抢到了！你也成为了'持有者'阶级。" },
           { label: "保持理性", outcomeHint: "[PSY -10] 看着同事赚钱庆祝，这种感觉比亏钱还难受。" }
        ],
        imageUrl: IMAGES.CROWD
      },
      {
        id: "s1-c6",
        title: "多巴胺调节阀",
        category: 'health',
        context: "工作压力太大？黑市医生推荐了新玩意。",
        dialogue: [
            { speaker: "黑市医生", text: "觉得人生没意思？装个调节阀，手动控制快乐。" },
            { speaker: "黑市医生", text: "虽然有成瘾风险，但在996的时候拧一下，你就感觉像在夏威夷度假。" }
        ],
        options: [
           { label: "安装调节阀", outcomeHint: "[Cash -2000, PSY +30] 世界变得美好了，哪怕是假象。" },
           { label: "拒绝依赖", outcomeHint: "[HP -10, PSY -20] 用肉体硬抗精神压力，濒临崩溃。" }
        ],
        imageUrl: IMAGES.HOSPITAL
      }
    ],
    random: [
      {
        id: "s1-r1",
        title: "遗失的数据盘",
        category: 'general',
        context: "你在黑市淘到一个加密数据盘。",
        dialogue: [
            { speaker: "你", text: "这加密看起来很复杂，说不定里面有比特币私钥..." },
            { speaker: "系统", text: "检测到未知接口，是否连接？" }
        ],
        options: [
          { label: "尝试解密", outcomeHint: "[Cash -1000, HP -15] 是病毒！神经系统过载了！" },
          { label: "直接销毁", outcomeHint: "[PSY -5] 也许你刚刚扔掉了一个亿。" }
        ],
        imageUrl: IMAGES.SHOP
      },
      {
        id: "s1-r2",
        title: "劣质电子皮肤",
        category: 'health',
        context: "为了在聚会上不丢面子，你贴了廉价的发光纹身。",
        dialogue: [
            { speaker: "你", text: "嘶...好痒。" },
            { speaker: "医生", text: "这玩意儿漏电，还在腐蚀你的真皮层。你是想省钱还是想要命？" }
        ],
        options: [
          { label: "激光治疗", outcomeHint: "[Cash -3000, HP +5] 花钱买教训。" },
          { label: "自行刮除", outcomeHint: "[HP -20, PSY -10] 鲜血淋漓，但也算是一种赛博朋克美学？" }
        ],
        imageUrl: IMAGES.HOSPITAL
      },
      {
        id: "s1-r3",
        title: "自动续费陷阱",
        category: 'general',
        context: "你发现账户在漏财。",
        dialogue: [
            { speaker: "客服AI", text: "您在两年前签署了'云端墓地'预售协议，退款需阅读800页条款并手抄一份。" },
            { speaker: "你", text: "我那时候只是点了个弹窗！" }
        ],
        options: [
          { label: "雇律师起诉", outcomeHint: "[Cash +1000, PSY -20] 耗费大量精力，只追回一小部分。" },
          { label: "认栽注销", outcomeHint: "[Cash -500] 及时止损，吃哑巴亏。" }
        ],
        imageUrl: IMAGES.SERVER
      },
      {
        id: "s1-r4",
        title: "帐篷区的暴雨",
        category: 'housing',
        requirements: { rentType: ['homeless'] },
        context: "酸雨腐蚀了你的廉价帐篷。",
        dialogue: [
            { speaker: "你", text: "衣服湿透了...这雨水还在烧皮肤。" },
            { speaker: "路人", text: "嘿，滚远点，别挡着网吧的门。" }
        ],
        options: [
          { label: "去24h网吧躲雨", outcomeHint: "[Cash -100, HP -5] 花点小钱买个座位。" },
          { label: "硬抗酸雨", outcomeHint: "[HP -20] 全身灼痛，发烧了。" }
        ],
        imageUrl: IMAGES.SLUMS
      }
    ]
  },

  // Stage 2: 资本寒冬 (Capital Winter)
  2: {
    core: [
      {
        id: "s2-c1",
        title: "合规性审计",
        category: 'work',
        context: "HR把你叫到了小黑屋。",
        dialogue: [
            { speaker: "HR", text: "公司正在进行'优化'。我们知道你很忠诚。" },
            { speaker: "HR", text: "如果你能提供旁边工位老王接私活的证据，这唯一的留任名额就是你的。" }
        ],
        options: [
           { label: "提交证据", outcomeHint: "[KAR -50, Cash +2000] 踩着别人的尸体上岸。老王被保安拖走了。" },
           { label: "保持沉默", outcomeHint: "[Cash -5000, KAR +10] 你保住了良心，但失去了薪水。" }
        ],
        imageUrl: IMAGES.OFFICE
      },
      {
        id: "s2-c2",
        title: "极限超频协议",
        category: 'work',
        context: "项目快完不成了。老板把一份协议拍在桌上。",
        dialogue: [
            { speaker: "老板", text: "签了这个，允许公司远程超频你的脑机芯片。" },
            { speaker: "老板", text: "虽然可能会烧坏脑子，但只要项目上线，奖金翻倍！" }
        ],
        options: [
           { label: "签署超频", outcomeHint: "[HP -40, Cash +15000] 脑浆沸腾的感觉！啊啊啊！" },
           { label: "拒绝冒险", outcomeHint: "[Cash -3000, PSY -10] 项目延期，你在全公司大会上被羞辱。" }
        ],
        imageUrl: IMAGES.BOSS
      },
      {
        id: "s2-c3",
        title: "猎头的诱惑",
        category: 'work',
        context: "竞对公司的猎头在虚拟酒吧找到了你。",
        dialogue: [
            { speaker: "猎头", text: "两倍薪资。只要你过来。" },
            { speaker: "猎头", text: "唯一的条件是...带上你们公司的核心代码库作为'投名状'。" }
        ],
        options: [
           { label: "带走代码", outcomeHint: "[KAR -80, Cash +40000] 商业间谍。高收益，极高法律风险。" },
           { label: "拒绝跳槽", outcomeHint: "[KAR +10] 留在即将沉没的船上。" }
        ],
        imageUrl: IMAGES.STREET
      },
      {
        id: "s2-c4",
        title: "思想监控植入",
        category: 'work',
        context: "为了防止内鬼，公司发布了新规定。",
        dialogue: [
            { speaker: "安保部", text: "全员植入深层潜意识监控。它能读出你对老板的真实看法。" },
            { speaker: "安保部", text: "不做亏心事，不怕鬼敲门，对吧？" }
        ],
        options: [
           { label: "接受监控", outcomeHint: "[PSY -25, Cash +1000] 变成了透明人，连做梦都要小心翼翼。" },
           { label: "购买干扰器", outcomeHint: "[Cash -2000, KAR -10] 每天都在演戏，生怕被发现。" }
        ],
        imageUrl: IMAGES.OFFICE
      },
      {
        id: "s2-c5",
        title: "有奖举报箱",
        category: 'work',
        context: "你偶然发现了主管挪用公款去赌博的证据。",
        dialogue: [
            { speaker: "系统", text: "检测到异常资金流。举报可获得追回金额的10%作为奖励。" },
            { speaker: "主管", text: "（路过）小伙子，最近表现不错，我看好你哦。" }
        ],
        options: [
           { label: "匿名举报", outcomeHint: "[Cash +8000, KAR -10] 拿到赏金，部门大清洗。你也感到一丝后怕。" },
           { label: "假装不知", outcomeHint: "[KAR +5] 明哲保身，直到主管东窗事发牵连到你。" }
        ],
        imageUrl: IMAGES.BOSS
      },
      {
        id: "s2-c6",
        title: "代币化薪资",
        category: 'work',
        context: "公司现金流断裂。",
        dialogue: [
            { speaker: "CEO", text: "为了共克时艰，本月工资将以'公司积分'发放。" },
            { speaker: "CEO", text: "积分可以在公司食堂和内部商城使用，这和钱没区别嘛！" }
        ],
        options: [
           { label: "接受积分", outcomeHint: "[Cash -6000] 废纸一张。现金流面临崩溃。" },
           { label: "带头抗议", outcomeHint: "[HP -15, PSY +10] 被安保打断了肋骨，但争取到了部分现金结算。" }
        ],
        imageUrl: IMAGES.CROWD
      }
    ],
    random: [
      {
        id: "s2-r1",
        title: "供氧配额削减",
        category: 'work',
        context: "办公室的空气变得稀薄。",
        dialogue: [
            { speaker: "行政", text: "降本增效，氧气浓度下调10%。" },
            { speaker: "你", text: "我脑子转不动了..." }
        ],
        options: [
          { label: "自费吸氧", outcomeHint: "[Cash -800, HP +5] 保持了工作效率。" },
          { label: "缺氧工作", outcomeHint: "[HP -10, PSY -10] 反应迟钝，像个行尸走肉。" }
        ],
        imageUrl: IMAGES.OFFICE
      },
      {
        id: "s2-r2",
        title: "义体缺乏维护",
        category: 'health',
        context: "由于没钱做保养，你的机械臂开始漏油。",
        dialogue: [
            { speaker: "路人", text: "什么味道？像烧焦的橡胶。" },
            { speaker: "你", text: "（试图掩盖手臂的抽搐）" }
        ],
        options: [
          { label: "黑市廉价油", outcomeHint: "[Cash -1500] 暂时止住了漏油，但气味刺鼻。" },
          { label: "胶带缠绕", outcomeHint: "[PSY -15] 每次抽搐都引来异样的目光。" }
        ],
        imageUrl: IMAGES.SHOP
      },
      {
        id: "s2-r3",
        title: "街头清扫日",
        category: 'housing',
        requirements: { rentType: ['homeless'] },
        context: "文明城市评选开始了。",
        dialogue: [
            { speaker: "广播", text: "为了市容市貌，请所有无固定住所人员配合转移。" },
            { speaker: "你", text: "转移去哪？下水道吗？" }
        ],
        options: [
          { label: "躲进下水道", outcomeHint: "[HP -15, PSY -10] 恶臭，老鼠，以及绝望。" },
          { label: "试图反抗", outcomeHint: "[HP -30] 被高压水枪冲走。" }
        ],
        imageUrl: IMAGES.SLUMS
      }
    ]
  },

  // Stage 3: 家庭与责任 (Family)
  3: {
    core: [
      {
        id: "s3-c1",
        title: "父亲的意识服务器",
        category: 'love',
        context: "父亲肉体死亡，意识已上传。但云服务商发来了账单。",
        dialogue: [
            { speaker: "服务商", text: "存储费涨价了。如果不续费，您父亲的意识将被'冷存储'。" },
            { speaker: "服务商", text: "就像植物人一样，有意识但无法交流。您忍心吗？" }
        ],
        options: [
           { label: "透支续费", outcomeHint: "[Cash -80000, KAR +30] 保住了父亲的'生命'，你的财务状况崩盘。" },
           { label: "同意归档", outcomeHint: "[KAR -50, PSY -40] 省下了钱，但感觉自己亲手杀了他。" }
        ],
        imageUrl: IMAGES.HOSPITAL
      },
      {
        id: "s3-c2",
        title: "净水区学区房",
        category: 'love',
        context: "未婚妻下了最后通牒。",
        dialogue: [
            { speaker: "未婚妻", text: "这里的水有重金属味！如果不买B区的房子，我就打掉孩子！" },
            { speaker: "未婚妻", text: "我不想生出一个畸形儿！" }
        ],
        options: [
           { label: "签署巨额房贷", outcomeHint: "[Cash -200000, PSY +20] 拥有了家，也拥有了三十年的奴隶契约。" },
           { label: "承认无能", outcomeHint: "[PSY -50] 婚事告吹，你保住了钱，失去了未来。" }
        ],
        imageUrl: IMAGES.APARTMENT
      },
      {
        id: "s3-c3",
        title: "弟弟的赌债",
        category: 'love',
        context: "弟弟在暗网赌博输掉了自己的肾脏所有权。",
        dialogue: [
            { speaker: "黑帮", text: "直播还有10分钟开始。要么打钱，要么看我们怎么掏空他。" },
            { speaker: "弟弟", text: "哥！救我！我再也不敢了！" }
        ],
        options: [
           { label: "替他还债", outcomeHint: "[Cash -50000, KAR +20] 积蓄被掏空。你知道他还会再赌的。" },
           { label: "切断直播", outcomeHint: "[KAR -40, PSY -30] 眼不见为净。你失去了一个亲人。" }
        ],
        imageUrl: IMAGES.SLUMS
      },
      {
        id: "s3-c4",
        title: "基因优化套餐",
        category: 'love',
        context: "产检显示胎儿基因有普通缺陷。",
        dialogue: [
            { speaker: "医生", text: "现在大家都买'精英编辑套餐'。智力+20，外貌+20。" },
            { speaker: "医生", text: "如果不买，孩子出生就是下等人，连好学校都进不去。" }
        ],
        options: [
           { label: "贷款购买套餐", outcomeHint: "[Cash -120000, PSY +15] 孩子是未来的希望，不能输在起跑线。" },
           { label: "自然分娩", outcomeHint: "[PSY -30] 愧疚感将伴随你一生，尤其是当孩子被歧视时。" }
        ],
        imageUrl: IMAGES.HOSPITAL
      },
      {
        id: "s3-c5",
        title: "云端去广告服务",
        category: 'love',
        context: "父亲发来消息。",
        dialogue: [
            { speaker: "父亲（意识）", text: "儿子，这里的广告太吵了...每5分钟就有一遍洗脑歌..." },
            { speaker: "父亲（意识）", text: "我感觉我的记忆都被广告词填满了..." }
        ],
        options: [
           { label: "购买VIP会员", outcomeHint: "[Cash -15000, KAR +10] 让老人在虚拟世界体面点。" },
           { label: "无视请求", outcomeHint: "[PSY -15] 每次通话，父亲都在念叨牙膏广告词。" }
        ],
        imageUrl: IMAGES.SERVER
      },
      {
        id: "s3-c6",
        title: "记忆回滚手术",
        category: 'love',
        context: "伴侣脑机中毒，遗忘了你们这三年的感情。",
        dialogue: [
            { speaker: "医生", text: "数据还在深层扇区，可以回滚恢复，但手术费很贵。" },
            { speaker: "伴侣", text: "你是谁？为什么眼神这么悲伤？" }
        ],
        options: [
           { label: "支付数据恢复", outcomeHint: "[Cash -60000, PSY +20] 买回了回忆，哪怕它是数据的堆砌。" },
           { label: "重新认识", outcomeHint: "[PSY -40] 一切都回不去了。" }
        ],
        imageUrl: IMAGES.APARTMENT
      }
    ],
    random: [
      {
        id: "s3-r1",
        title: "流浪者的宠物",
        category: 'love',
        requirements: { rentType: ['homeless'] },
        context: "你捡到一只生病的电子狗。",
        dialogue: [
            { speaker: "电子狗", text: "滋滋...电量低...系统错误..." },
            { speaker: "你", text: "你也是被抛弃的吗？" }
        ],
        options: [
          { label: "修复它", outcomeHint: "[Cash -200, KAR +10] 它是你唯一的陪伴。" },
          { label: "拆解卖零件", outcomeHint: "[Cash +50, KAR -10] 为了生存，不择手段。" }
        ],
        imageUrl: IMAGES.SLUMS
      }
    ]
  },

  // Stage 4: 身心临界点 (Breaking Point)
  4: {
    core: [
      {
        id: "s4-c1",
        title: "器官抵押通知",
        category: 'health',
        context: "你的贷款逾期了。左臂义体突然锁死。",
        dialogue: [
            { speaker: "系统", text: "警告：资产回收程序启动。左臂将在24小时后远程引爆脱离。" },
            { speaker: "债主", text: "没钱？那就用胳膊抵债！" }
        ],
        options: [
           { label: "变卖资产还贷", outcomeHint: "[Cash -30000, HP +10] 保住了手臂，资产归零。" },
           { label: "暴力破解锁", outcomeHint: "[Cash -2000, HP -30] 强行启用手臂，神经束烧毁，剧痛无比。" }
        ],
        imageUrl: IMAGES.HOSPITAL
      },
      {
        id: "s4-c2",
        title: "现实解离症",
        category: 'health',
        context: "长期高压，你开始分不清现实与VR。",
        dialogue: [
            { speaker: "你", text: "那个路人的脸...为什么是一堆乱码？" },
            { speaker: "医生", text: "这是重度解离症。你需要专业的疗养，或者...来点狠货。" }
        ],
        options: [
           { label: "昂贵的疗养院", outcomeHint: "[Cash -40000, PSY +50] 专业的治疗，让你重返人间。" },
           { label: "街头致幻剂", outcomeHint: "[Cash -500, HP -20, PSY +20] 既然分不清，不如彻底沉沦。" }
        ],
        imageUrl: IMAGES.SUBWAY
      },
      {
        id: "s4-c3",
        title: "强制唤醒剂",
        category: 'work',
        context: "你在工位上晕倒了。",
        dialogue: [
            { speaker: "急救AI", text: "检测到休克。建议注射'肾上腺素-X'。" },
            { speaker: "急救AI", text: "副作用：寿命缩短。正作用：能让你立刻爬起来再干12小时。" }
        ],
        options: [
           { label: "注射并工作", outcomeHint: "[HP -50, Cash +10000] 用半条命换来了全勤奖。" },
           { label: "拒绝并回家", outcomeHint: "[Cash -20000] 旷工被辞退，没有赔偿。" }
        ],
        imageUrl: IMAGES.OFFICE
      },
      {
        id: "s4-c4",
        title: "脑灰质溶解",
        category: 'health',
        context: "脑机接口过热导致大脑皮层轻微液化。",
        dialogue: [
            { speaker: "医生", text: "你的脑子快煮熟了。" },
            { speaker: "医生", text: "要么花大钱做再生修复，要么切掉这部分脑叶...会变傻，但能活。" }
        ],
        options: [
           { label: "再生酶治疗", outcomeHint: "[Cash -50000, HP +30] 昂贵，但能保住智商。" },
           { label: "切除受损脑叶", outcomeHint: "[HP -20, PSY -40] 记忆模糊了，快乐也模糊了。" }
        ],
        imageUrl: IMAGES.HOSPITAL
      },
      {
        id: "s4-c5",
        title: "滤镜失效",
        category: 'health',
        context: "你的视觉滤镜坏了。没有了美化滤镜，你看到了真实的城市。",
        dialogue: [
            { speaker: "你", text: "天啊...墙上全是呕吐物...天空是灰色的..." },
            { speaker: "路人", text: "这疯子在看什么？" }
        ],
        options: [
           { label: "立即修复滤镜", outcomeHint: "[Cash -3000, PSY +10] 回到美好的虚假世界。" },
           { label: "直面真实", outcomeHint: "[PSY -25, KAR +15] 痛苦的觉醒。你看到了真相。" }
        ],
        imageUrl: IMAGES.STREET
      },
      {
        id: "s4-c6",
        title: "黑市狂暴药剂",
        category: 'health',
        context: "身体已经动不了了，但只要完成这一单就能翻身。",
        dialogue: [
            { speaker: "黑市贩子", text: "军用级狂暴剂。打一针，你就是超人。" },
            { speaker: "黑市贩子", text: "至于药效过后的副作用...那是明天的问题，对吧？" }
        ],
        options: [
           { label: "注射药剂", outcomeHint: "[HP -40, Cash +20000] 燃烧生命最后的余晖。" },
           { label: "放弃机会", outcomeHint: "[Cash -5000] 被时代抛弃的废物。" }
        ],
        imageUrl: IMAGES.SLUMS
      }
    ],
    random: [
      {
        id: "s4-r1",
        title: "寒夜",
        category: 'housing',
        requirements: { rentType: ['homeless'] },
        context: "今晚气温骤降。",
        dialogue: [
            { speaker: "你", text: "好冷...手指没有知觉了。" },
            { speaker: "系统", text: "体温过低警报。" }
        ],
        options: [
          { label: "不停走动", outcomeHint: "[HP -10] 消耗体力维持体温。" },
          { label: "点燃垃圾取暖", outcomeHint: "[KAR -5, HP -5] 吸入有毒烟雾，但暖和了一点。" }
        ],
        imageUrl: IMAGES.STREET
      }
    ]
  },

  // Stage 5: 最终审判 (The Verdict)
  5: {
    core: [
      {
        id: "s5-c1",
        title: "清道夫敲门",
        category: 'general',
        context: "你的个人破产保护期结束了。",
        dialogue: [
            { speaker: "门外", text: "资产回收队！开门！" },
            { speaker: "门外", text: "根据协议，你的眼球、肾脏和肝脏现在归银行所有！" }
        ],
        options: [
           { label: "变卖器官", outcomeHint: "[Cash +40000, HP -50] 活着，但支离破碎。" },
           { label: "跳窗逃亡", outcomeHint: "[HP -70, KAR -50] 成为通缉犯，流血不止。" }
        ],
        imageUrl: IMAGES.SLUMS
      },
      {
        id: "s5-c2",
        title: "最后一张船票",
        category: 'general',
        context: "通往'极乐空间'的飞船即将起飞。这是逃离地球废土的唯一机会。",
        dialogue: [
            { speaker: "黄牛", text: "最后一张票！一口价！" },
            { speaker: "黄牛", text: "上面的空气是甜的，没有辐射，没有996。你想去吗？" }
        ],
        options: [
           { label: "倾尽所有买票", outcomeHint: "[Cash -1000000] 赌一把。如果钱够，你就赢了。" },
           { label: "留在地球", outcomeHint: "[Cash 0] 认命。在这个烂泥塘里腐烂。" }
        ],
        imageUrl: IMAGES.HIGH_END
      },
      {
        id: "s5-c3",
        title: "意识上传协议",
        category: 'general',
        context: "一家巨头公司提出购买你的意识。",
        dialogue: [
            { speaker: "代理人", text: "恭喜，你被选中了。上传意识，获得永生。" },
            { speaker: "代理人", text: "虽然是作为算力单元工作，但我们会给你家人一笔巨款。" }
        ],
        options: [
           { label: "签署卖身契", outcomeHint: "[Cash +500000, KAR -80] 留给家人巨款，自己成为永恒的奴隶。" },
           { label: "宁愿死亡", outcomeHint: "[KAR +20] 自由的灵魂比永生更重要。" }
        ],
        imageUrl: IMAGES.SERVER
      },
      {
        id: "s5-c4",
        title: "地下城避难所",
        category: 'housing',
        context: "地表辐射超标警报拉响。",
        dialogue: [
            { speaker: "警报", text: "辐射风暴将在30分钟后抵达。" },
            { speaker: "守卫", text: "地下城只对VIP开放。没票的滚开！" }
        ],
        options: [
           { label: "购买入场券", outcomeHint: "[Cash -200000, HP +20] 活得久一点，像老鼠一样。" },
           { label: "留在地表", outcomeHint: "[HP -40] 等待辐射病慢慢侵蚀你的细胞。" }
        ],
        imageUrl: IMAGES.SUBWAY
      },
      {
        id: "s5-c5",
        title: "反抗军的邀请",
        category: 'general',
        context: "城市爆发了暴动。",
        dialogue: [
            { speaker: "反抗军", text: "这狗娘养的世界！跟我们一起干吧！" },
            { speaker: "反抗军", text: "我们可能活不过今晚，但我们要烧毁公司的大楼！" }
        ],
        options: [
           { label: "加入起义", outcomeHint: "[HP -60, KAR +60] 成为英雄，或者烈士。" },
           { label: "躲在废墟", outcomeHint: "[HP -10] 苟且偷生。" }
        ],
        imageUrl: IMAGES.CROWD
      },
      {
        id: "s5-c6",
        title: "最后的晚餐",
        category: 'general',
        context: "世界末日般的感觉。",
        dialogue: [
            { speaker: "你", text: "如果这是最后一餐..." },
            { speaker: "侍者", text: "先生，我们有真正的自然牛肉，不是合成的。就是价格..." }
        ],
        options: [
           { label: "豪掷千金", outcomeHint: "[Cash -15000, PSY +40] 至少死的时候，胃是满足的。" },
           { label: "吃过期罐头", outcomeHint: "[PSY -20] 凄凉的结局。" }
        ],
        imageUrl: IMAGES.SHOP
      }
    ],
    random: []
  }
};
