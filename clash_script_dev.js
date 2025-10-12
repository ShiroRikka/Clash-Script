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
    // 【关键重构】: 将优先级整合进配置，使数据内聚，避免分离维护导致的不一致问题
    // priority: 数值越小，优先级越高（越先匹配）
    regionFilters: {
      香港节点: {
        priority: 10,
        icon: `${ICON_BASE_URL}flags/hk.svg`,
        filter: "(?i)\\b(港|HK|hk|Hong Kong|HongKong|hongkong)\\b",
      },
      台湾节点: {
        priority: 11,
        icon: `${ICON_BASE_URL}flags/tw.svg`,
        filter: "(?i)\\b(台|新北|彰化|TW|Taiwan)\\b",
      },
      新加坡节点: {
        priority: 20,
        icon: `${ICON_BASE_URL}flags/sg.svg`,
        filter: "(?i)\\b(新加坡|坡|狮城|SG|Singapore)\\b",
      },
      日本节点: {
        priority: 21,
        icon: `${ICON_BASE_URL}flags/jp.svg`,
        filter: "(?i)\\b(日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan)\\b",
      },
      韩国节点: {
        priority: 22,
        icon: `${ICON_BASE_URL}flags/kr.svg`,
        filter: "(?i)\\b(KR|Korea|韩国|首尔)\\b",
      },
      美国节点: {
        priority: 30,
        icon: `${ICON_BASE_URL}flags/us.svg`,
        filter:
          "(?i)\\b(美|硅谷|拉斯维加斯|西雅图|芝加哥|US|USA|United States)\\b",
      },
      加拿大节点: {
        priority: 31,
        icon: `${ICON_BASE_URL}flags/ca.svg`,
        filter: "(?i)\\b(CA|Canada|加拿大|多伦多|温哥华)\\b",
      },
      英国节点: {
        priority: 40,
        icon: `${ICON_BASE_URL}flags/gb.svg`,
        filter: "(?i)\\b(UK|GB|United Kingdom|英国|伦敦|Britain)\\b",
      },
      德国节点: {
        priority: 50,
        icon: `${ICON_BASE_URL}flags/de.svg`,
        filter: "(?i)\\b(DE|Germany|德国|法兰克福)\\b",
      },
      法国节点: {
        priority: 51,
        icon: `${ICON_BASE_URL}flags/fr.svg`,
        filter: "(?i)\\b(FR|France|法国|巴黎)\\b",
      },
      俄罗斯节点: {
        priority: 60,
        icon: `${ICON_BASE_URL}flags/ru.svg`,
        filter: "(?i)\\b(RU|Russia|俄罗斯|莫斯科)\\b",
      },
      印度节点: {
        priority: 70,
        icon: `${ICON_BASE_URL}flags/in.svg`,
        filter: "(?i)\\b(IND|India|印度|孟买)\\b",
      },
      荷兰节点: {
        priority: 71,
        icon: `${ICON_BASE_URL}flags/nl.svg`,
        filter: "(?i)\\b(NL|Netherlands|荷兰|阿姆斯特丹)\\b",
      },
      越南节点: {
        priority: 80,
        icon: `${ICON_BASE_URL}flags/vn.svg`,
        filter: "(?i)\\b(VN|Vietnam|越南)\\b",
      },
      伊朗节点: {
        priority: 90,
        icon: `${ICON_BASE_URL}flags/ir.svg`,
        filter: "(?i)\\b(IR|Iran|伊朗|德黑兰)\\b",
      },
      联合国节点: {
        priority: 95,
        icon: `${ICON_BASE_URL}flags/un.svg`,
        filter: "(?i)\\b(UN|United Nations|联合国)\\b",
      },
      中国节点: {
        priority: 100, // 优先级最低，确保模糊的CN标识最后匹配
        icon: `${ICON_BASE_URL}flags/cn.svg`,
        filter: "(?i)\\b(中国|沪|京|浙|苏|CN|China)\\b",
      },
    },
    ruleProviders: {
      // ... ruleProviders 配置保持不变 ...
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
   * 【最终优化】基于内聚配置进行优先级分类
   * @param {Array} allProxies - 所有代理节点
   * @param {Object} regionFilters - 内聚的地区筛选器配置
   * @returns {Object} 包含已分类的代理和未分类的“其他”代理
   */
  function categorizeProxiesByRegion(allProxies, regionFilters) {
    const regionProxies = {};
    let remainingProxies = [...allProxies];

    // 【核心逻辑】: 将配置条目按 priority 升序排列，确保高优先级先匹配
    const sortedRegionEntries = Object.entries(regionFilters).sort(
      (a, b) => a[1].priority - b[1].priority
    );

    for (const [regionName, regionConfig] of sortedRegionEntries) {
      const pattern = regionConfig.filter.replace(/^\(\?i\)/, "");
      const regex = new RegExp(pattern, "i");

      const matchedProxies = remainingProxies.filter((proxy) =>
        regex.test(proxy.name)
      );

      if (matchedProxies.length > 0) {
        regionProxies[regionName] = {
          proxies: matchedProxies,
          icon: regionConfig.icon, // 直接从配置中获取图标，保证一一对应
        };
        remainingProxies = remainingProxies.filter(
          (proxy) => !matchedProxies.includes(proxy)
        );
      }
    }

    return {
      regionProxies,
      otherProxies: remainingProxies,
    };
  }

  /**
   * 构建代理选择器列表
   * @param {Object} regionProxies - 已分类的代理对象
   * @param {boolean} includeOther - 是否包含“其他节点”
   * @param {Array} additional - 额外添加的代理
   * @returns {Array} 代理选择器列表
   */
  function buildProxyList(regionProxies, includeOther, additional = []) {
    const list = Object.keys(regionProxies);
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

  // 调用优化后的分类函数，不再需要外部的 priority 列表
  const { regionProxies, otherProxies } = categorizeProxiesByRegion(
    allProxies,
    settings.regionFilters
  );

  const availableRegions = Object.keys(regionProxies);
  const hasOtherNodes = otherProxies.length > 0;
  const commonFallbackProxies = ["自动选择", "手动切换", "DIRECT"];

  const proxyGroups = [];

  // --- 代理组定义 ---

  // 节点选择
  proxyGroups.push({
    name: "节点选择",
    icon: `${ICON_BASE_URL}adjust.svg`,
    type: "select",
    proxies: buildProxyList(
      regionProxies,
      hasOtherNodes,
      commonFallbackProxies
    ),
  });

  // 按可用地区创建分组
  for (const regionName of availableRegions) {
    // 【关键修复】: 直接从我们自己的分类结果中获取所有需要的信息
    // 这确保了名称、图标、节点列表三者之间绝对的正确对应关系
    const groupData = regionProxies[regionName];
    proxyGroups.push({
      name: regionName,
      icon: groupData.icon,
      type: "url-test",
      proxies: groupData.proxies.map((proxy) => proxy.name),
      interval: 300,
      tolerance: 50,
    });
  }

  // 其他节点
  if (hasOtherNodes) {
    proxyGroups.push({
      name: "其他节点",
      icon: `https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png`,
      type: "url-test",
      proxies: otherProxies.map((proxy) => proxy.name),
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
      regionProxies,
      hasOtherNodes,
      commonFallbackProxies
    ),
  });

  // GLOBAL
  const globalProxies = buildProxyList(
    { 节点选择: {}, 自动选择: {}, 手动切换: {}, ...regionProxies }, // 伪对象以复用函数
    hasOtherNodes,
    ["广告拦截", "应用净化", "漏网之鱼"]
  ).filter(
    (name) =>
      !["节点选择", "自动选择", "手动切换"].includes(name) ||
      name === "节点选择"
  ); // 简单去重和排序

  proxyGroups.push({
    name: "GLOBAL",
    icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
    type: "select",
    proxies: [
      "节点选择",
      "自动选择",
      "手动切换",
      ...availableRegions,
      ...(hasOtherNodes ? ["其他节点"] : []),
      "广告拦截",
      "应用净化",
      "漏网之鱼",
    ],
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
