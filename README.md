
## 描述

该脚本用于配置 Clash，例如Verge和FlClash，特别是定义规则提供者和规则。它从 [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules) 
GitHub 
仓库加载规则集，并动态查找主代理组名称。

## 功能

*   定义 Loyalsoldier/clash-rules 的 rule-providers。
*   动态查找主代理组名称。
*   构建自定义规则列表。
*   替换 rule-providers 到当前配置。

## 使用方法

复制内容→侧边栏→订阅→全局配拓展脚本→粘贴

## 规则提供者

以下是脚本中定义的规则提供者：

*   reject: 广告域名列表
*   icloud: iCloud 域名列表
*   apple: Apple 在中国大陆可直连的域名列表
*   google: \[慎用]Google 在中国大陆可直连的域名列表
*   proxy: 代理域名列表
*   direct: 直连域名列表
*   private: 私有网络专用域名列表
*   gfw: GFWList 域名列表
*   tld-not-cn: 非中国大陆使用的顶级域名列表
*   telegramcidr: Telegram 使用的 IP 地址列表
*   cncidr: 中国大陆 IP 地址列表
*   lancidr: 局域网 IP 及保留 IP 地址列表
*   applications: 需要直连的常见软件列表
