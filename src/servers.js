const getLink = serverName => {
  switch (serverName) {
    case 'EUW': {
      const url = 'https://signup.euw.leagueoflegends.com/en/signup/';
      const region = 'EUW1';
      return { url, region };
    }
    case 'EUNE': {
      const url = 'https://signup.eune.leagueoflegends.com/en/signup/';
      const region = 'EUN1';
      return { url, region };
    }
    case 'NA': {
      const url = 'https://signup.na.leagueoflegends.com/en/signup/';
      const region = 'NA1';
      return { url, region };
    }
    case 'BR': {
      const url = 'https://signup.br.leagueoflegends.com/pt/signup/index#/';
      const region = 'BR1';
      return { url, region };
    }
    case 'TR': {
      const url = 'https://signup.tr.leagueoflegends.com/tr/signup/index';
      const region = 'TR1';
      return { url, region };
    }
    case 'RU': {
      const url = 'https://signup.ru.leagueoflegends.com/ru/signup/index#/';
      const region = 'RU';
      return { url, region };
    }

    case 'OCE': {
      const url = 'https://signup.oce.leagueoflegends.com/en/signup/index/';
      const region = 'OC1';
      return { url, region };
    }

    case 'LAN': {
      const url = 'https://signup.lan.leagueoflegends.com/en/signup/index#/';
      const region = 'LA1';
      return { url, region };
    }
    case 'LAS': {
      const url = 'https://signup.las.leagueoflegends.com/en/signup/index#/';
      const region = 'LA2';
      return { url, region };
    }
    default: {
      const url = 'https://signup.euw.leagueoflegends.com/en/signup/';
      const region = 'EUW1';
      return { url, region };
    }
  }
};

export default getLink;
