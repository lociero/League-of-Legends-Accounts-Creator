# League of Legends Accounts Creator

## Requirements

- Captcha subscription:
  - [CapMonster.Cloud (recommended)](https://capmonster.cloud/)
  - [2Captcha](http://2captcha.com/?from=8859803)
  - [RuCaptcha](https://rucaptcha.com?from=9296293)
  - [Anti-Captcha](http://getcaptchasolution.com/3ddik9kzvd)
  - [Capsolver](https://dashboard.capsolver.com/passport/register?inviteCode=0ZyAex_d1l3H)

## How to use

1. [Open last release.](https://github.com/lociero/League-of-Legends-Accounts-Creator/releases/latest)
2. Download, unzip and run `acc-creator-react.<version>.exe`.
3. Configure your settings (server, amount, ..., captcha, proxy).
4. Generate your list (it does not create accounts yet so you can check if you did all right).
5. Start creation.
6. Created accounts are saved to `./accounts` directory in 3 formats FULL and COMPACT and CUSTOM.

## Settings

1. Server. Supported: EUW, EUNE, NA, BR, TR, RU, OCE, LAN, LAS, JP, PH, SG, TH, TW, VN.
2. Email. (Custom emails, custom domains, random domains)
3. Username. (Custom list, Random)
4. Password. (Length, One for all)
5. Date of Birth. (Random, One for all)
6. Proxy. (Own proxy list / free proxies from proxyscrape.com / Rotating proxies support)

## FAQ
### Is it free?
Yes. But captcha recognition service is required and its not free.

### What CAPTCHA_ZERO_BALANCE error means and why captcha service is required?
Riot signup service is protected with captcha so captcha recognition service is required for creation. CAPTCHA_ZERO_BALANCE means you dont have enough money on your captcha balance.

### What RATE_LIMITED error means?
You can create only 10 accounts at once from 1 ip. If you need more use proxies.

### I'm using free proxies and have a bad success creation rate, why?
Free proxies are super unstable. I highly recommend paid ones like [IpRoyal](https://iproyal.com?r=megaded) and [ProxyCheap](https://app.proxy-cheap.com/r/0TMQxQ). Or you can use your own ofc. I recommend rotating proxies, on proxy list generation use 1 specific country please and if you want to know creation ip use session(sticky ip) option. Use at least 1 different proxy for 5 accounts to not be rate limited.

## If you want to build it by yourself

```bash
# Clone this repository
git clone https://github.com/lociero/League-of-Legends-Accounts-Creator
# Go into the repository
cd League-of-Legends-Accounts-Creator
# Install dependencies
npm ci
# Package
npm run package
# Or feel free to change anything you need
npm run dev
```

## Special thanks for support

```
Telitsyn Sergey // sl******yn@gmail.com
Ya Boi // prist*******l2014@gmail.com
钟 宏敬 // zh****8@hotmail.com
Juan Campillos // diagno******le@gmail.com
```

## Contacts

### Provide me full information please if you got problems: 
 1. Creator version;
 2. Captcha service you used;
 3. Proxies you used (free / paid);
 4. What errors you got;
 5. Some additional information you think may be useful.

I rarely reply to simple hello messages or meta questions like `Are you here?` Please do not waste your time it will help both of us. I will answer as fast as I can if you provided enough info. Cheers.

```
Discord: megaded#1529
Email: omgoole@ya.ru
```

## You can support development with crypto if you want:

```
BTC: bc1qnnt73euphhuvtf2phzsycmcajv2kugkjrk4xcz
USDT: TTkAQtbMGrm2PwYcV4GYyAwXJjHDUeHXAb
USDC: 0x5481f0Ccb95F7b4609D6BAC12d2d88d05981f04a
ETH: 0x5481f0Ccb95F7b4609D6BAC12d2d88d05981f04a
TRX: TTkAQtbMGrm2PwYcV4GYyAwXJjHDUeHXAb
LTC: LeTefZ9e8gaf7nrhZtxMY8BsWud8oDssbT
BINANCE: omgoole@ya.ru
```

### Peace & Love for everyone! ❤️
