function main(config) {
  // =================================================================
  // 1. 常量与配置
  // =================================================================
  // 将重复使用的 URL 提取为常量，便于统一管理和更换
  const ICON_BASE_URL =
    "https://testingcf.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/";
  const RULESET_BASE_URL =
    "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/";

  // 核心配置对象
const settings = {
  regionFilters: {
    美国节点: {
      icon: `${ICON_BASE_URL}flags/us.svg`,
      filter: "(?i)\\b(美|硅谷|拉斯维加斯|西雅图|芝加哥|US|United States)\\b",
    },
    日本节点: {
      icon: `${ICON_BASE_URL}flags/jp.svg`,
      filter: "(?i)\\b(日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan)\\b",
    },
    新加坡节点: {
      icon: `${ICON_BASE_URL}flags/sg.svg`,
      filter: "(?i)\\b(新加坡|坡|狮城|SG|Singapore)\\b",
    },
    香港节点: {
      icon: `${ICON_BASE_URL}flags/hk.svg`,
      filter: "(?i)\\b(港|HK|hk|Hong Kong|HongKong|hongkong)\\b",
    },
    台湾节点: {
      icon: `${ICON_BASE_URL}flags/tw.svg`,
      filter: "(?i)\\b(台|新北|彰化|TW|Taiwan)\\b",
    },
    中国节点: {
      icon: `${ICON_BASE_URL}flags/cn.svg`,
      filter: "(?i)\\b(中国|沪|京|浙|苏|CN|China)\\b",
    },
    加拿大节点: {
      icon: `${ICON_BASE_URL}flags/ca.svg`,
      filter: "(?i)\\b(CA|Canada|加拿大|多伦多|温哥华)\\b",
    },
    德国节点: {
      icon: `${ICON_BASE_URL}flags/de.svg`,
      filter: "(?i)\\b(DE|Germany|德国|法兰克福)\\b",
    },
    法国节点: {
      icon: `${ICON_BASE_URL}flags/fr.svg`,
      filter: "(?i)\\b(FR|France|法国|巴黎)\\b",
    },
    俄罗斯节点: {
      icon: `${ICON_BASE_URL}flags/ru.svg`,
      filter: "(?i)\\b(RU|Russia|俄罗斯|莫斯科)\\b",
    },
    韩国节点: {
      icon: `${ICON_BASE_URL}flags/kr.svg`,
      filter: "(?i)\\b(KR|Korea|韩国|首尔)\\b",
    },
    联合国节点: {
      icon: `${ICON_BASE_URL}flags/un.svg`,
      filter: "(?i)\\b(UN|United Nations|联合国)\\b",
    },
    英国节点: {
      icon: `${ICON_BASE_URL}flags/gb.svg`,
      filter: "(?i)\\b(UK|GB|United Kingdom|英国|伦敦|Britain)\\b",
    },
    印度节点: {
      icon: `${ICON_BASE_URL}flags/in.svg`,
      filter: "(?i)\\b(IND|India|印度|孟买)\\b",
    },
    荷兰节点: {
      icon: `${ICON_BASE_URL}flags/nl.svg`,
      filter: "(?i)\\b(NL|Netherlands|荷兰|阿姆斯特丹)\\b",
    },
    越南节点: {
      icon: `${ICON_BASE_URL}flags/vn.svg`,
      filter: "(?i)\\b(VN|Vietnam|越南)\\b",
    },
    伊朗节点: {
      icon: `${ICON_BASE_URL}flags/ir.svg`,
      filter: "(?i)\\b(IR|Iran|伊朗|德黑兰)\\b",
    },
  },
    ruleProviders: {
      LocalAreaNetwork: {
        type: "http",
        behavior: "classical",
        url: `${RULESET_BASE_URL}LocalAreaNetwork.list`,
        path: "./ruleset/LocalAreaNetwork.list",
        interval: 86400,
      },
      UnBan: {
        type: "http",
        behavior: "classical",
        url: `${RULESET_BASE_URL}UnBan.list`,
        path: "./ruleset/UnBan.list",
        interval: 86400,
      },
      BanAD: {
        type: "http",
        behavior: "classical",
        url: `${RULESET_BASE_URL}BanAD.list`,
        path: "./ruleset/BanAD.list",
        interval: 86400,
      },
      BanProgramAD: {
        type: "http",
        behavior: "classical",
        url: `${RULESET_BASE_URL}BanProgramAD.list`,
        path: "./ruleset/BanProgramAD.list",
        interval: 86400,
      },
      ProxyGFWlist: {
        type: "http",
        behavior: "classical",
        url: `${RULESET_BASE_URL}ProxyGFWlist.list`,
        path: "./ruleset/ProxyGFWlist.list",
        interval: 86400,
      },
      ChinaDomain: {
        type: "http",
        behavior: "domain",
        url: `${RULESET_BASE_URL}ChinaDomain.list`,
        path: "./ruleset/ChinaDomain.list",
        interval: 86400,
      },
      ChinaCompanyIp: {
        type: "http",
        behavior: "ipcidr",
        url: `${RULESET_BASE_URL}ChinaCompanyIp.list`,
        path: "./ruleset/ChinaCompanyIp.list",
        interval: 86400,
      },
      Download: {
        type: "http",
        behavior: "classical",
        url: `${RULESET_BASE_URL}Download.list`,
        path: "./ruleset/Download.list",
        interval: 86400,
      },
    },
  };

  // =================================================================
  // 2. 辅助函数
  // =================================================================

  /**
   * 分析并筛选出可用的地区分组及其代理
   * @param {Array} allProxies - 所有代理节点
   * @param {Object} regionFilters - 地区筛选器配置
   * @returns {Object} 包含可用地区列表、是否存在“其他”节点、以及编译后的筛选器
   */
  function analyzeAvailableRegions(allProxies, regionFilters) {
    const compiledFilters = {};
    const availableRegions = [];

    // 预编译所有正则表达式，避免在循环中重复创建，提升性能
    for (const [name, config] of Object.entries(regionFilters)) {
      // 移除 Clash 特有的 (?i) 标志，并使用 JS 的 'i' 标志
      const pattern = config.filter.replace(/^\(\?i\)/, "");
      compiledFilters[name] = { ...config, regex: new RegExp(pattern, "i") };
    }

    // 筛选出包含节点的地区
    for (const [regionName, regionData] of Object.entries(compiledFilters)) {
      const hasMatchingProxy = allProxies.some((proxy) =>
        regionData.regex.test(proxy.name)
      );
      if (hasMatchingProxy) {
        availableRegions.push(regionName);
      }
    }

    // 检查是否存在未被任何规则匹配的“其他”节点
    const hasOtherNodes = allProxies.some((proxy) => {
      return !Object.values(compiledFilters).some((regionData) =>
        regionData.regex.test(proxy.name)
      );
    });

    return { availableRegions, hasOtherNodes, compiledFilters };
  }

  /**
   * 构建代理选择器列表
   * @param {Array} regions - 可用地区列表
   * @param {boolean} includeOther - 是否包含“其他节点”
   * @param {Array} additional - 额外添加的代理
   * @returns {Array} 代理选择器列表
   */
  function buildProxyList(regions, includeOther, additional = []) {
    const list = [...regions];
    if (includeOther) {
      list.push("其他节点");
    }
    list.push(...additional);
    return list;
  }

  // =================================================================
  // 3. 主逻辑
  // =================================================================
  const allProxies = config.proxies || [];
  const { availableRegions, hasOtherNodes, compiledFilters } =
    analyzeAvailableRegions(allProxies, settings.regionFilters);

  const proxyGroups = [];
  const commonFallbackProxies = ["自动选择", "手动切换", "DIRECT"];

  // --- 代理组定义 ---

  // 节点选择
  proxyGroups.push({
    name: "节点选择",
    icon: `${ICON_BASE_URL}adjust.svg`,
    type: "select",
    proxies: buildProxyList(
      availableRegions,
      hasOtherNodes,
      commonFallbackProxies
    ),
  });

  // 按可用地区创建分组
  for (const regionName of availableRegions) {
    const regionConfig = settings.regionFilters[regionName];
    proxyGroups.push({
      name: regionName,
      icon: regionConfig.icon,
      type: "url-test",
      "include-all": true,
      filter: regionConfig.filter, // 交由 Clash 进行原生过滤，效率更高
      interval: 300,
      tolerance: 50,
    });
  }

  // 其他节点
  if (hasOtherNodes) {
    // 优化：生成一个更健壮的 exclude-filter
    const excludeFilterKeywords = Object.values(settings.regionFilters)
      .map((r) => r.filter.replace(/^\(\?i\)/, ""))
      .join("|");

    proxyGroups.push({
      name: "其他节点",
      icon: `https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png`, // 假设此路径，或使用其他图标
      type: "url-test",
      "include-all": true,
      "exclude-filter": `(?i)${excludeFilterKeywords}`,
      interval: 300,
      tolerance: 50,
    });
  }

  // 自动选择
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

  // 广告拦截
  proxyGroups.push({
    name: "广告拦截",
    icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",
    type: "select",
    proxies: ["REJECT", "DIRECT", "节点选择"],
  });

  // 应用净化
  proxyGroups.push({
    name: "应用净化",
    icon: `${ICON_BASE_URL}guard.svg`,
    type: "select",
    proxies: ["REJECT", "DIRECT", "节点选择"],
  });

  // 漏网之鱼
  proxyGroups.push({
    name: "漏网之鱼",
    icon: `${ICON_BASE_URL}fish.svg`,
    type: "select",
    proxies: buildProxyList(
      availableRegions,
      hasOtherNodes,
      commonFallbackProxies
    ),
  });

  // GLOBAL
  const globalProxies = buildProxyList(
    ["节点选择", "自动选择", "手动切换", ...availableRegions],
    hasOtherNodes,
    ["广告拦截", "应用净化", "漏网之鱼"]
  );
  proxyGroups.push({
    name: "GLOBAL",
    icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
    type: "select",
    proxies: globalProxies,
  });

  // =================================================================
  // 4. 配置整合与返回
  // =================================================================
  config["proxy-groups"] = proxyGroups;
  config["rule-providers"] = settings.ruleProviders;
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
    "MATCH,漏网之鱼",
  ];

  return config;
}
