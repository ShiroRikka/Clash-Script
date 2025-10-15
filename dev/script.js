function main(config) {
    // 获取所有代理节点
    const allProxies = config.proxies || [];

    const CDN_BASE = "https://testingcf.jsdelivr.net/gh";
    const FLAGS_CDN = "https://testingcf.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/"

    // 定义地区过滤规则
    const REGION_RULES = {
        "美国节点": {
            icon: `${FLAGS_CDN}/us.svg`,
            filter: /美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States/i
        },
        "日本节点": {
            icon: `${FLAGS_CDN}/jp.svg`,
            filter: /日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan/i
        },
        "狮城节点": {
            icon: `${FLAGS_CDN}/sg.svg`,
            filter: /新加坡|坡|狮城|SG|Singapore/i
        },
        "香港节点": {
            icon: `${FLAGS_CDN}/hk.svg`,
            filter: /港|HK|hk|Hong Kong|HongKong|hongkong/i
        },
        "台湾节点": {
            icon: `${FLAGS_CDN}/tw.svg`,
            filter: /台|新北|彰化|TW|Taiwan/i
        }
    };

    // 优化：在一次遍历中完成所有分组和识别未匹配项的工作
    const groupedProxies = {};
    const ungroupedProxies = [];

    const ruleEntries = Object.entries(REGION_RULES);

    for (const proxy of allProxies) {
        let matched = false;
        for (const [regionName, rule] of ruleEntries) {
            if (rule.filter.test(proxy.name)) {
                if (!groupedProxies[regionName]) {
                    groupedProxies[regionName] = {
                        icon: rule.icon,
                        proxies: []
                    };
                }
                groupedProxies[regionName].proxies.push(proxy);
                matched = true;
                break; // 一个节点只属于一个地区，找到后跳出内层循环
            }
        }
        if (!matched) {
            ungroupedProxies.push(proxy);
        }
    }

    // 从结果中提取所需信息
    const availableRegions = Object.keys(groupedProxies);
    const hasOtherNodes = ungroupedProxies.length > 0;

    const excludePattern = hasOtherNodes ? new RegExp(
        Object.values(REGION_RULES).map(rule => rule.filter.source).join('|'),
        'i'
    ) : undefined;

    // 构建"节点选择"的代理列表
    const nodeSelectionProxies = [];
    availableRegions.forEach(region => nodeSelectionProxies.push(region));
    if (hasOtherNodes) nodeSelectionProxies.push("其他节点");
    nodeSelectionProxies.push("自动选择", "手动切换", "DIRECT");

    const proxyGroups = [];
    // 节点选择
    proxyGroups.push({
        name: "节点选择",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
        type: "select",
        proxies: nodeSelectionProxies
    });

    // 自动选择（自动选择延迟最低的节点）
    proxyGroups.push({
        name: "自动选择",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Auto.png",
        "include-all": true,
        type: "url-test",
        interval: 300,
        tolerance: 50
    });

    // 手动切换
    proxyGroups.push({
        name: "手动切换",
        icon: "https://testingcf.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png",
        "include-all": true,
        type: "select"
    });

    // 添加有节点的地区分组
    for (const [regionName, regionConfig] of Object.entries(REGION_RULES)) {
        if (availableRegions.includes(regionName)) {
            proxyGroups.push({
                name: regionName,
                icon: regionConfig.icon,
                "include-all": true,
                filter: regionConfig.filter,
                type: "url-test",
                interval: 300,
                tolerance: 50
            });
        }
    }

    // 如果有其他节点，添加"其他节点"分组
    if (hasOtherNodes) {
        proxyGroups.push({
            name: "其他节点",
            icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
            "include-all": true,
            "exclude-filter": excludePattern,
            type: "url-test",
            interval: 300,
            tolerance: 50
        });
    }

    // 广告拦截
    proxyGroups.push({
        name: "广告拦截",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",
        type: "select",
        proxies: ["REJECT", "DIRECT"]
    });

    // 应用净化
    proxyGroups.push({
        name: "应用净化",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hijacking.png",
        type: "select",
        proxies: ["REJECT", "DIRECT"]
    });

    // 构建"漏网之鱼"的代理列表
    const finalProxies = ["节点选择"];
    availableRegions.forEach(region => finalProxies.push(region));
    if (hasOtherNodes) finalProxies.push("其他节点");
    finalProxies.push("自动选择", "手动切换", "DIRECT");

    // 漏网之鱼
    proxyGroups.push({
        name: "漏网之鱼",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png",
        type: "select",
        proxies: finalProxies
    });

    // 构建 GLOBAL 的代理列表
    const globalProxies = ["节点选择", "自动选择", "手动切换"];
    availableRegions.forEach(region => globalProxies.push(region));
    if (hasOtherNodes) globalProxies.push("其他节点");
    globalProxies.push("广告拦截", "应用净化", "漏网之鱼");

    // GLOBAL
    proxyGroups.push({
        name: "GLOBAL",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
        "include-all": true,
        type: "select",
        proxies: globalProxies
    });

    config["proxy-groups"] = proxyGroups;

    // 规则提供者配置
    config["rule-providers"] = {
        LocalAreaNetwork: {
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/LocalAreaNetwork.list",
            path: "./ruleset/LocalAreaNetwork.list",
            behavior: "classical",
            interval: 86400,
            format: "text",
            type: "http"
        },
        UnBan: {
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/UnBan.list",
            path: "./ruleset/UnBan.list",
            behavior: "classical",
            interval: 86400,
            format: "text",
            type: "http"
        },
        BanAD: {
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanAD.list",
            path: "./ruleset/BanAD.list",
            behavior: "classical",
            interval: 86400,
            format: "text",
            type: "http"
        },
        BanProgramAD: {
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanProgramAD.list",
            path: "./ruleset/BanProgramAD.list",
            behavior: "classical",
            interval: 86400,
            format: "text",
            type: "http"
        },
        ProxyGFWlist: {
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ProxyGFWlist.list",
            path: "./ruleset/ProxyGFWlist.list",
            behavior: "classical",
            interval: 86400,
            format: "text",
            type: "http"
        },
        ChinaDomain: {
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaDomain.list",
            path: "./ruleset/ChinaDomain.list",
            behavior: "domain",
            interval: 86400,
            format: "text",
            type: "http"
        },
        ChinaCompanyIp: {
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaCompanyIp.list",
            path: "./ruleset/ChinaCompanyIp.list",
            behavior: "ipcidr",
            interval: 86400,
            format: "text",
            type: "http"
        },
        Download: {
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Download.list",
            path: "./ruleset/Download.list",
            behavior: "classical",
            interval: 86400,
            format: "text",
            type: "http"
        }
    };

    config["rules"] = [
        "RULE-SET,LocalAreaNetwork,DIRECT",
        "RULE-SET,UnBan,DIRECT",
        "RULE-SET,BanAD,广告拦截",
        "RULE-SET,BanProgramAD,应用净化",
        "RULE-SET,ProxyGFWlist,节点选择",
        "RULE-SET,ChinaDomain,DIRECT",
        "RULE-SET,ChinaCompanyIp,DIRECT",
        "RULE-SET,Download,DIRECT",
        "GEOIP,CN,DIRECT",
        "MATCH,漏网之鱼"
    ];

    return config;
}