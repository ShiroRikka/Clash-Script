// v1.1.1
function main(config) {
  // 获取所有代理节点
  const allProxies = config.proxies || [];
  const CDN_BASE = "https://cdn.jsdelivr.net/gh/";
  const FLAGS_CDN = `${CDN_BASE}lipis/flag-icons@main/flags/4x3/`;
  // 定义地区过滤规则
  const regionFilters = {
    美国节点: {
      icon: `${FLAGS_CDN}us.svg`,
      filter: "美|波特兰|US|United States",
    },
    日本节点: {
      icon: `${FLAGS_CDN}jp.svg`,
      filter: "日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan",
    },
    新加坡节点: {
      icon: `${FLAGS_CDN}sg.svg`,
      filter: "新加坡|坡|狮城|SG|Singapore",
    },
    香港节点: {
      icon: `${FLAGS_CDN}hk.svg`,
      filter: "港|HK|hk|Hong Kong|HongKong|hongkong",
    },
    台湾节点: {
      icon: `${FLAGS_CDN}tw.svg`,
      filter: "台|新北|彰化|TW|Taiwan",
    },
    加拿大节点: {
      icon: `${FLAGS_CDN}ca.svg`,
      filter: "CA|Canada|加拿大|多伦多|温哥华",
    },
    德国节点: {
      icon: `${FLAGS_CDN}de.svg`,
      filter: "DE|Germany|德国|法兰克福",
    },
    法国节点: {
      icon: `${FLAGS_CDN}fr.svg`,
      filter: "FR|France|法国|巴黎",
    },
    俄罗斯节点: {
      icon: `${FLAGS_CDN}ru.svg`,
      filter: "RU|Russia|俄罗斯|莫斯科",
    },
    韩国节点: {
      icon: `${FLAGS_CDN}kr.svg`,
      filter: "KR|Korea|韩国|首尔",
    },
    联合国节点: {
      icon: `${FLAGS_CDN}un.svg`,
      filter: "UN|United Nations|联合国",
    },
    英国节点: {
      icon: `${FLAGS_CDN}gb.svg`,
      filter: "UK|GB|United Kingdom|英国|伦敦|Britain",
    },
    印度节点: {
      icon: `${FLAGS_CDN}in.svg`,
      filter: "IND|India|印度|孟买",
    },
    荷兰节点: {
      icon: `${FLAGS_CDN}nl.svg`,
      filter: "NL|Netherlands|荷兰|阿姆斯特丹",
    },
    越南节点: {
      icon: `${FLAGS_CDN}vn.svg`,
      filter: "VN|Vietnam|越南",
    },
    伊朗节点: {
      icon: `${FLAGS_CDN}ir.svg`,
      filter: "IR|Iran|伊朗|德黑兰",
    },
    澳大利亚节点: {
      icon: `${FLAGS_CDN}au.svg`,
      filter: "AU|Australia|澳大利亚|悉尼|墨尔本",
    },
    瑞典节点: {
      icon: `${FLAGS_CDN}se.svg`,
      filter: "SE|Sweden|瑞典|斯德哥尔摩",
    },
    中国节点: {
      icon: `${FLAGS_CDN}cn.svg`,
      filter: "CN|China|中国|宁波",
    },
  };

  // 检测每个地区是否有节点
  const availableRegions = [];
  const regionProxies = {};

  for (const [regionName, regionConfig] of Object.entries(regionFilters)) {
    const regex = new RegExp(regionConfig.filter, "i");
    const matchedProxies = allProxies.filter((proxy) => regex.test(proxy.name));

    if (matchedProxies.length > 0) {
      availableRegions.push(regionName);
      regionProxies[regionName] = matchedProxies;
    }
  }

  // 构建"其他节点"的排除过滤器
  const excludePattern = Object.values(regionFilters)
    .map((r) => r.filter)
    .join("|");

  // 检测是否有"其他节点"
  const otherRegex = new RegExp(excludePattern, "i");
  const otherProxies = allProxies.filter(
    (proxy) => !otherRegex.test(proxy.name)
  );
  const hasOtherNodes = otherProxies.length > 0;

  // 定义全局策略组，方便统一管理
  const GLOBAL_STRATEGIES = [
    "自动选择",
    "自动回退",
    "负载均衡-轮询",
    "负载均衡-哈希",
    "负载均衡-粘滞",
    "手动切换",
  ];

  // 构建代理组列表
  const proxyGroups = [];

  // 构建"节点选择"的代理列表
  const nodeSelectionProxies = [];
  availableRegions.forEach((region) => nodeSelectionProxies.push(region));
  if (hasOtherNodes) nodeSelectionProxies.push("其他节点");
  nodeSelectionProxies.push(...GLOBAL_STRATEGIES, "DIRECT");

  // 节点选择
  proxyGroups.push({
    name: "节点选择",
    icon: `${CDN_BASE}Koolson/Qure@master/IconSet/Color/Proxy.png`,
    type: "select",
    proxies: nodeSelectionProxies,
  });

  // 自动选择（自动选择延迟最低的节点）
  proxyGroups.push({
    name: "自动选择",
    icon: `${CDN_BASE}Koolson/Qure@master/IconSet/Color/Auto.png`,
    "include-all": true,
    type: "url-test",
    interval: 300,
    tolerance: 50,
  });

  // 自动回退（按顺序选择可用节点）
  proxyGroups.push({
    name: "自动回退",
    icon: `${CDN_BASE}shindgewongxj/WHATSINStash@master/icon/fallback.png`,
    "include-all": true,
    type: "fallback",
    url: "https://www.gstatic.com/generate_204",
    interval: 300,
  });

  // 负载均衡（在多个节点间分散流量）
  proxyGroups.push({
    name: "负载均衡-轮询",
    icon: `${CDN_BASE}clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg`,
    "include-all": true,
    type: "load-balance",
    url: "https://www.gstatic.com/generate_204",
    interval: 300,
    strategy: "round-robin",
  });

  proxyGroups.push({
    name: "负载均衡-哈希",
    icon: `${CDN_BASE}clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg`,
    "include-all": true,
    type: "load-balance",
    url: "https://www.gstatic.com/generate_204",
    interval: 300,
    strategy: "consistent-hashing",
  });

  proxyGroups.push({
    name: "负载均衡-粘滞",
    icon: `${CDN_BASE}clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg`,
    "include-all": true,
    type: "load-balance",
    url: "https://www.gstatic.com/generate_204",
    interval: 300,
    strategy: "sticky-sessions",
  });

  // 手动切换
  proxyGroups.push({
    name: "手动切换",
    icon: `${CDN_BASE}shindgewongxj/WHATSINStash@master/icon/select.png`,
    "include-all": true,
    type: "select",
  });

  // 添加有节点的地区分组
  for (const [regionName, regionConfig] of Object.entries(regionFilters)) {
    if (availableRegions.includes(regionName)) {
      proxyGroups.push({
        name: regionName,
        icon: regionConfig.icon,
        "include-all": true,
        filter: regionConfig.filter,
        type: "url-test",
        interval: 300,
        tolerance: 50,
      });
    }
  }

  // 如果有其他节点，添加"其他节点"分组
  if (hasOtherNodes) {
    proxyGroups.push({
      name: "其他节点",
      icon: `${CDN_BASE}Koolson/Qure@master/IconSet/Color/Global.png`,
      "include-all": true,
      "exclude-filter": excludePattern,
      type: "url-test",
      interval: 300,
      tolerance: 50,
    });
  }

  // 广告拦截
  proxyGroups.push({
    name: "广告拦截",
    icon: `${CDN_BASE}Koolson/Qure@master/IconSet/Color/AdBlack.png`,
    type: "select",
    proxies: ["REJECT", "DIRECT"],
  });

  // 应用净化
  proxyGroups.push({
    name: "应用净化",
    icon: `${CDN_BASE}Koolson/Qure@master/IconSet/Color/Hijacking.png`,
    type: "select",
    proxies: ["REJECT", "DIRECT"],
  });

  // 构建"漏网之鱼"的代理列表
  const finalProxies = ["节点选择"];
  availableRegions.forEach((region) => finalProxies.push(region));
  if (hasOtherNodes) finalProxies.push("其他节点");
  finalProxies.push(...GLOBAL_STRATEGIES, "DIRECT");

  // 漏网之鱼
  proxyGroups.push({
    name: "漏网之鱼",
    icon: `${CDN_BASE}Koolson/Qure@master/IconSet/Color/Final.png`,
    type: "select",
    proxies: finalProxies,
  });

  // 构建 GLOBAL 的代理列表
  const globalProxies = ["节点选择", ...GLOBAL_STRATEGIES];
  availableRegions.forEach((region) => globalProxies.push(region));
  if (hasOtherNodes) globalProxies.push("其他节点");
  globalProxies.push("广告拦截", "应用净化", "漏网之鱼");

  // GLOBAL
  proxyGroups.push({
    name: "GLOBAL",
    icon: `${CDN_BASE}Koolson/Qure@master/IconSet/Color/Global.png`,
    "include-all": true,
    type: "select",
    proxies: globalProxies,
  });

  config["proxy-groups"] = proxyGroups;

  // 规则提供者配置
  config["rule-providers"] = {
    LocalAreaNetwork: {
      url: `${CDN_BASE}ACL4SSR/ACL4SSR@master/Clash/LocalAreaNetwork.list`,
      path: "./ruleset/LocalAreaNetwork.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http",
    },
    UnBan: {
      url: `${CDN_BASE}ACL4SSR/ACL4SSR@master/Clash/UnBan.list`,
      path: "./ruleset/UnBan.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http",
    },
    BanAD: {
      url: `${CDN_BASE}ACL4SSR/ACL4SSR@master/Clash/BanAD.list`,
      path: "./ruleset/BanAD.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http",
    },
    BanProgramAD: {
      url: `${CDN_BASE}ACL4SSR/ACL4SSR@master/Clash/BanProgramAD.list`,
      path: "./ruleset/BanProgramAD.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http",
    },
    ProxyGFWlist: {
      url: `${CDN_BASE}ACL4SSR/ACL4SSR@master/Clash/ProxyGFWlist.list`,
      path: "./ruleset/ProxyGFWlist.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http",
    },
    ChinaDomain: {
      url: `${CDN_BASE}ACL4SSR/ACL4SSR@master/Clash/ChinaDomain.list`,
      path: "./ruleset/ChinaDomain.list",
      behavior: "domain",
      interval: 86400,
      format: "text",
      type: "http",
    },
    ChinaCompanyIp: {
      url: `${CDN_BASE}ACL4SSR/ACL4SSR@master/Clash/ChinaCompanyIp.list`,
      path: "./ruleset/ChinaCompanyIp.list",
      behavior: "ipcidr",
      interval: 86400,
      format: "text",
      type: "http",
    },
    Download: {
      url: `${CDN_BASE}ACL4SSR/ACL4SSR@master/Clash/Download.list`,
      path: "./ruleset/Download.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http",
    },
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
    "MATCH,漏网之鱼",
  ];

  return config;
}
