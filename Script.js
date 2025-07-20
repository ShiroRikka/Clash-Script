// Define main function (script entry)

function main(config, profileName) {
    // 1. 定义 Loyalsoldier/clash-rules 的 rule-providers
    // 这部分是固定的，用于从 Loyalsoldier 的 GitHub 仓库加载规则集
    const customRuleProviders = {
        //广告域名列表
        reject: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
            path: "./ruleset/reject.yaml",
            interval: 86400,
        },
        //iCloud 域名列表
        icloud: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
            path: "./ruleset/icloud.yaml",
            interval: 86400,
        },
        //Apple 在中国大陆可直连的域名列表
        apple: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
            path: "./ruleset/apple.yaml",
            interval: 86400,
        },
        //[慎用]Google 在中国大陆可直连的域名列表
        google: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
            path: "./ruleset/google.yaml",
            interval: 86400,
        },
        //代理域名列表
        proxy: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
            path: "./ruleset/proxy.yaml",
            interval: 86400,
        },
        //直连域名列表
        direct: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
            path: "./ruleset/direct.yaml",
            interval: 86400,
        },
        //私有网络专用域名列表
        private: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
            path: "./ruleset/private.yaml",
            interval: 86400,
        },
        //GFWList 域名列表
        gfw: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
            path: "./ruleset/gfw.yaml",
            interval: 86400,
        },
        //非中国大陆使用的顶级域名列表
        "tld-not-cn": {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
            path: "./ruleset/tld-not-cn.yaml",
            interval: 86400,
        },
        //Telegram 使用的 IP 地址列表
        telegramcidr: {
            type: "http",
            behavior: "ipcidr",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
            path: "./ruleset/telegramcidr.yaml",
            interval: 86400,
        },
        //中国大陆 IP 地址列表
        cncidr: {
            type: "http",
            behavior: "ipcidr",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
            path: "./ruleset/cncidr.yaml",
            interval: 86400,
        },
        //局域网 IP 及保留 IP 地址列表
        lancidr: {
            type: "http",
            behavior: "ipcidr",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
            path: "./ruleset/lancidr.yaml",
            interval: 86400,
        },
        //需要直连的常见软件列表
        applications: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
            path: "./ruleset/applications.yaml",
            interval: 86400,
        },
    };

    // 2. 动态查找主代理组名称
    // 默认的兜底代理组名称，如果配置文件中没有找到合适的代理组，将使用此名称
    let mainProxyGroup = profileName;

    // 检查配置文件中是否存在代理组，并且是数组类型
    const groupNames = config["proxy-groups"].map((group) => group.name);

    // 3. 构建自定义规则列表，使用动态确定的 mainProxyGroup
    const customRules = [
        // RULE-SET,applications,DIRECT: 优先处理应用程序规则，例如某些应用可能需要直连，避免代理引起的问题
        "RULE-SET,applications,DIRECT",
        // DOMAIN,clash.razord.top,DIRECT: Clash Verge Web UI 的域名直连，确保管理界面始终可用
        "DOMAIN,clash.razord.top,DIRECT",
        // DOMAIN,yacd.haishan.me,DIRECT: Yacd (Yet Another Clash Dashboard) 的域名直连，确保其管理界面可用
        "DOMAIN,yacd.haishan.me,DIRECT",
        // RULE-SET,private,DIRECT: 私有网络流量直连，通常包括局域网地址，避免不必要的代理
        "RULE-SET,private,DIRECT",
        // RULE-SET,reject,REJECT: 拒绝广告和恶意流量，提高上网体验和安全性
        "RULE-SET,reject,REJECT",
        // RULE-SET,icloud,DIRECT: iCloud 服务直连，通常这些服务不需要代理，以保证稳定性和速度
        "RULE-SET,icloud,DIRECT",
        // RULE-SET,apple,DIRECT: Apple 服务直连，与 iCloud 类似，确保 Apple 生态系统服务正常运行
        "RULE-SET,apple,DIRECT",
        // RULE-SET,google,${mainProxyGroup}: Google 服务走代理，因为在中国大陆通常无法直连
        `RULE-SET,google,${mainProxyGroup}`,
        // RULE-SET,proxy,${mainProxyGroup}: 其他需要代理的流量，通过主代理组进行转发
        `RULE-SET,proxy,${mainProxyGroup}`,
        // RULE-SET,direct,DIRECT: 直连流量，通常包括不需要代理的常用网站或服务
        "RULE-SET,direct,DIRECT",
        // RULE-SET,lancidr,DIRECT: 本地局域网 IP 直连，确保内网通信不受影响
        "RULE-SET,lancidr,DIRECT",
        // RULE-SET,cncidr,DIRECT: 中国大陆 IP 直连，符合中国大陆网络访问策略
        "RULE-SET,cncidr,DIRECT",
        // RULE-SET,telegramcidr,${mainProxyGroup}: Telegram 的 IP 范围走代理，因为 Telegram 在某些地区可能被限制
        `RULE-SET,telegramcidr,${mainProxyGroup}`,
        // GEOIP,LAN,DIRECT: 基于地理位置的规则：局域网 IP 直连，与 lancidr 类似，确保内网通信
        "GEOIP,LAN,DIRECT",
        // GEOIP,CN,DIRECT: 基于地理位置的规则：中国大陆 IP 直连，确保中国大陆流量直连
        "GEOIP,CN,DIRECT",
        // MATCH,${mainProxyGroup}: 兜底规则：所有未匹配到的流量都走主代理组，确保所有流量都有处理方式
        `MATCH,${mainProxyGroup}`,
    ];

    // 4. 替换 rule-providers 到当前配置
    config["rule-providers"] = customRuleProviders;

    // 将自定义规则放在现有规则的最前面，确保它们具有最高的匹配优先级
    config.rules = customRules;

    const autoSelectGroup = config["proxy-groups"].find(
        (group) => group.type === "url-test"
    );

    autoSelectGroup.interval = 300;



    console.log(config);
    // 返回修改后的配置
    return config;
}
