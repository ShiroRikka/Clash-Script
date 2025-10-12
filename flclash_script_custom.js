// 自用
function main(config) {
    // 获取所有代理节点
    const allProxies = config.proxies || [];

    // 定义地区过滤规则
    const regionFilters = {
      美国节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png",
        filter:
          "(?i)美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States",
      },
      日本节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png",
        filter: "(?i)日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan",
      },
      新加坡节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png",
        filter: "(?i)新加坡|坡|狮城|SG|Singapore",
      },
      香港节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png",
        filter: "(?i)港|HK|hk|Hong Kong|HongKong|hongkong",
      },
      台湾节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png",
        filter: "(?i)台|新北|彰化|TW|Taiwan",
      },
      中国节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/China.png",
        filter:
          "(?i)中国|沪|京|浙|苏|粤|川|渝|CN|China|上海|北京|广州|深圳|杭州|成都|重庆|南京|武汉|天津|西安|苏州",
      },
      加拿大节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Canada.png",
        filter: "(?i)CA|Canada|加拿大|多伦多|温哥华",
      },
      德国节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Germany.png",
        filter: "(?i)DE|Germany|德国|法兰克福",
      },
      法国节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/France.png",
        filter: "(?i)FR|France|法国|巴黎",
      },
      俄罗斯节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Russia.png",
        filter: "(?i)RU|Russia|俄罗斯|莫斯科",
      },
      韩国节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png",
        filter: "(?i)KR|Korea|韩国|首尔",
      },
      联合国节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_Nations.png",
        filter: "(?i)UN|United Nations|联合国",
      },
      英国节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png",
        filter: "(?i)UK|United Kingdom|英国|伦敦|Britain",
      },
      印度节点: {
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/India.png",
        filter: "(?i)IND|India|印度|孟买",
      },
    };

    // 辅助函数：用于构建代理组的选择器列表
    function buildProxyList({ regions, hasOther, additional = [] }) {
        const list = [...regions];
        if (hasOther) {
            list.push("其他节点");
        }
        list.push(...additional);
        return list;
    }

    // 预编译正则表达式，提高效率
    const compiledRegionFilters = {};
    for (const [regionName, regionConfig] of Object.entries(regionFilters)) {
        const pattern = regionConfig.filter.replace(/\(\?i\)/g, "");
        compiledRegionFilters[regionName] = {
            ...regionConfig,
            regex: new RegExp(pattern, "i"),
        };
    }

    // 检测每个地区是否有节点，并收集匹配的节点
    const availableRegions = [];
    const regionProxies = {};

    for (const [regionName, regionData] of Object.entries(
        compiledRegionFilters
    )) {
        const matchedProxies = allProxies.filter((proxy) =>
            regionData.regex.test(proxy.name)
        );
        if (matchedProxies.length > 0) {
            availableRegions.push(regionName);
            regionProxies[regionName] = matchedProxies;
        }
    }

    // 构建"其他节点"的排除过滤器
    const excludePattern = Object.values(regionFilters)
        .map((r) => r.filter.replace(/\(\?i\)/g, ""))
        .join("|");

    // 检测是否有"其他节点"
    const otherRegex = new RegExp(excludePattern, "i");
    const otherProxies = allProxies.filter(
        (proxy) => !otherRegex.test(proxy.name)
    );
    const hasOtherNodes = otherProxies.length > 0;

    // 构建代理组列表
    const proxyGroups = [];

    // 通用后备代理列表
    const commonFallbackProxies = ["自动选择", "手动切换", "DIRECT"];

    // 节点选择
    proxyGroups.push({
        name: "节点选择",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
        type: "select",
        proxies: buildProxyList({
            regions: availableRegions,
            hasOther: hasOtherNodes,
            additional: commonFallbackProxies,
        }),
    });

    // 自动选择（自动选择延迟最低的节点）
    proxyGroups.push({
        name: "自动选择",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Auto.png",
        type: "url-test",
        "include-all": true,
        interval: 300,
        tolerance: 50,
    });

    // 手动切换
    proxyGroups.push({
        name: "手动切换",
        icon: "https://testingcf.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png",
        type: "select",
        "include-all": true,
    });

    // 添加有节点的地区分组
    for (const regionName of availableRegions) {
        const regionConfig = regionFilters[regionName];
        proxyGroups.push({
            name: regionName,
            icon: regionConfig.icon,
            type: "url-test",
            "include-all": true,
            filter: regionConfig.filter,
            interval: 300,
            tolerance: 50,
        });
    }

    // 如果有其他节点，添加"其他节点"分组
    if (hasOtherNodes) {
        proxyGroups.push({
            name: "其他节点",
            icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
            type: "url-test",
            "include-all": true,
            "exclude-filter": excludePattern,
            interval: 300,
            tolerance: 50,
        });
    }

    // 广告拦截
    proxyGroups.push({
        name: "广告拦截",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",
        type: "select",
        proxies: ["REJECT", "DIRECT"],
    });

    // 应用净化
    proxyGroups.push({
        name: "应用净化",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hijacking.png",
        type: "select",
        proxies: ["REJECT", "DIRECT"],
    });

    // 漏网之鱼
    proxyGroups.push({
        name: "漏网之鱼",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png",
        type: "select",
        proxies: buildProxyList({
            regions: availableRegions,
            hasOther: hasOtherNodes,
            additional: commonFallbackProxies,
        }),
    });

    // GLOBAL
    const globalProxies = [
        "节点选择",
        "自动选择",
        "手动切换",
        ...availableRegions,
    ];
    if (hasOtherNodes) {
        globalProxies.push("其他节点");
    }
    globalProxies.push("广告拦截", "应用净化", "漏网之鱼");

    proxyGroups.push({
        name: "GLOBAL",
        icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
        type: "select",
        "include-all": true,
        proxies: globalProxies,
    });

    config["proxy-groups"] = proxyGroups;

    // 规则提供者配置
    config["rule-providers"] = {
        // 局域网 IP
        LocalAreaNetwork: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/LocalAreaNetwork.list",
            path: "./ruleset/LocalAreaNetwork.list",
            interval: 86400,
        },
        // 白名单（防止误杀）
        UnBan: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/UnBan.list",
            path: "./ruleset/UnBan.list",
            interval: 86400,
        },
        // 广告拦截
        BanAD: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanAD.list",
            path: "./ruleset/BanAD.list",
            interval: 86400,
        },
        // 应用程序广告拦截
        BanProgramAD: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanProgramAD.list",
            path: "./ruleset/BanProgramAD.list",
            interval: 86400,
        },
        // 代理列表（常用网站）
        ProxyGFWlist: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ProxyGFWlist.list",
            path: "./ruleset/ProxyGFWlist.list",
            interval: 86400,
        },
        // 中国大陆域名
        ChinaDomain: {
            type: "http",
            behavior: "domain",
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaDomain.list",
            path: "./ruleset/ChinaDomain.list",
            interval: 86400,
        },
        // 中国大陆 IP
        ChinaCompanyIp: {
            type: "http",
            behavior: "ipcidr",
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaCompanyIp.list",
            path: "./ruleset/ChinaCompanyIp.list",
            interval: 86400,
        },
        // 下载（BT、PT 等）
        Download: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Download.list",
            path: "./ruleset/Download.list",
            interval: 86400,
        },
    };

    // 规则集
    config["rules"] = [
        // 局域网直连
        "RULE-SET,LocalAreaNetwork,DIRECT",
        // 白名单列表直连
        "RULE-SET,UnBan,DIRECT",
        // 广告拦截
        "RULE-SET,BanAD,广告拦截",
        // 应用程序广告拦截
        "RULE-SET,BanProgramAD,应用净化",
        // 代理列表
        "RULE-SET,ProxyGFWlist,节点选择",
        // 中国大陆域名直连
        "RULE-SET,ChinaDomain,DIRECT",
        // 中国大陆 IP 直连
        "RULE-SET,ChinaCompanyIp,DIRECT",
        // 下载工具直连
        "RULE-SET,Download,DIRECT",
        // 中国大陆 IP 直连
        "GEOIP,CN,DIRECT",
        // 最终规则（所有其它请求）
        "MATCH,漏网之鱼",
    ];

    return config;
}