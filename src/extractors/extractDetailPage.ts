import { load } from 'cheerio';
import { AnimeDetails } from '../types';

export const extractDetailpage = (html: string): AnimeDetails => {
  const $ = load(html);

  const obj: AnimeDetails = {
    title: '',
    alternativeTitle: '',
    japanese: '',
    id: '',
    poster: '',
    rating: '',
    type: '',
    episodes: {
      sub: 0,
      dub: 0,
      eps: 0,
    },
    synopsis: '',
    synonyms: '',
    aired: {
      from: '',
      to: '',
    },
    premiered: '',
    duration: '',
    status: '',
    MAL_score: '',
    genres: [],
    studios: '',
    producers: [],
    moreSeasons: [],
    related: [],
    mostPopular: [],
    recommended: [],
  };

  // all information elements
  const main = $('#ani_detail .anis-content');
  const moreSeasons = $('#main-content .block_area-seasons');
  const relatedAndMostPopular = $('.block_area.block_area_sidebar.block_area-realtime');
  const recommended = $(
    '.block_area.block_area_category .tab-content .block_area-content .film_list-wrap .flw-item'
  );

  // extract about info
  obj.poster = main.find('.film-poster .film-poster-img').attr('src') || '';

  const titleEl = main.find('.anisc-detail .film-name');
  obj.title = titleEl.text() || '';
  obj.alternativeTitle = titleEl.attr('data-jname') || '';

  const info = main.find('.film-stats .tick');

  obj.rating = info.find('.tick-pg').text() || '';
  obj.episodes.sub = Number(info.find('.tick-sub').text()) || 0;
  obj.episodes.dub = Number(info.find('.tick-dub').text()) || 0;
  obj.episodes.eps = info.find('.tick-eps').length
    ? Number(info.find('.tick-eps').text())
    : Number(info.find('.tick-sub').text()) || 0;

  obj.type = info.find('.item').first().text() || '';

  const id = main.find('.film-buttons .btn');
  obj.id = id.length ? id.attr('href')?.split('/').at(-1) || '' : '';

  const moreInfo = main.find('.anisc-info-wrap .anisc-info .item');

  // extract detailed info
  moreInfo.each((i, el) => {
    const name = $(el).find('.item-head').text();

    switch (name) {
      case 'Overview:':
        obj.synopsis = $(el).find('.text').text().trim() || '';
        break;
      case 'Japanese:':
        obj.japanese = $(el).find('.name').text() || '';
        break;
      case 'Synonyms:':
        obj.synonyms = $(el).find('.name').text() || '';
        break;
      case 'Aired:': {
        const airedText = $(el).find('.name').text() || '';
        const aired = airedText.split('to');
        obj.aired.from = aired[0]?.trim() || '';
        if (aired.length > 1) {
          const secondPart = aired[1]?.trim();
          obj.aired.to = secondPart === '?' ? '' : secondPart || '';
        } else {
          obj.aired.to = '';
        }
        break;
      }
      case 'Premiered:':
        obj.premiered = $(el).find('.name').text() || '';
        break;
      case 'Duration:':
        obj.duration = $(el).find('.name').text() || '';
        break;
      case 'Status:':
        obj.status = $(el).find('.name').text() || '';
        break;
      case 'MAL Score:':
        obj.MAL_score = $(el).find('.name').text() || '';
        break;
      case 'Genres:':
        obj.genres = $(el)
          .find('a')
          .map((i, genre) => $(genre).text())
          .get();
        break;
      case 'Studios:':
        obj.studios = $(el).find('a').text() || '';
        break;
      case 'Producers:':
        obj.producers = $(el)
          .find('a')
          .map((i, producer) => $(producer).attr('href')?.split('/').at(-1) || '')
          .get();
        break;
      default:
        break;
    }
  });

  // extract more seasons
  if (moreSeasons.length) {
    moreSeasons.find('.os-list .os-item').each((i, el) => {
      const innerObj = {
        title: '',
        alternativeTitle: '',
        id: '',
        poster: '',
        isActive: false,
      };
      innerObj.title = $(el).attr('title') || '';
      innerObj.id = $(el).attr('href')?.split('/').pop() || '';
      innerObj.alternativeTitle = $(el).find('.title').text() || '';
      const posterEl = $(el).find('.season-poster').attr('style') || '';
      const match = posterEl.match(/url\((['"])?(.*?)\1\)/);
      innerObj.poster = match?.[2] ?? '';

      innerObj.isActive = $(el).hasClass('active');
      obj.moreSeasons.push(innerObj);
    });
  }

  // extract related and most popular
  const extractRelatedAndMostPopular = (index: number, array: typeof obj.related | typeof obj.mostPopular) => {
    relatedAndMostPopular
      .eq(index)
      .find('.block_area.block_area_sidebar .cbox.cbox-list .ulclear li')
      .each((i, el) => {
        const innerObj = {
          title: '',
          alternativeTitle: '',
          id: '',
          poster: '',
          type: '',
          episodes: {
            sub: 0,
            dub: 0,
            eps: 0,
          },
        };

        const titleEl = $(el).find('.film-name .dynamic-name');
        innerObj.title = titleEl.text() || '';
        innerObj.alternativeTitle = titleEl.attr('data-jname') || '';
        innerObj.id = titleEl.attr('href')?.split('/').pop() || '';

        const infor = $(el).find('.fd-infor .tick');

        innerObj.type =
          infor
            .contents()
            .filter((_, el) => el.type === 'text' && $(el).text().trim() !== '')
            .text()
            .trim() || '';

        innerObj.episodes.sub = Number(infor.find('.tick-sub').text()) || 0;
        innerObj.episodes.dub = Number(infor.find('.tick-dub').text()) || 0;

        const epsEl = infor.find('.tick-eps').length
          ? infor.find('.tick-eps').text()
          : infor.find('.tick-sub').text();

        innerObj.episodes.eps = Number(epsEl) || 0;

        innerObj.poster = $(el).find('.film-poster .film-poster-img').attr('data-src') || '';

        array.push(innerObj);
      });
  };

  if (relatedAndMostPopular.length > 1) {
    extractRelatedAndMostPopular(0, obj.related);
    extractRelatedAndMostPopular(1, obj.mostPopular);
  } else if (relatedAndMostPopular.length === 1) {
    extractRelatedAndMostPopular(0, obj.mostPopular);
  }

  // extract recommended
  recommended.each((i, el) => {
    const innerObj = {
      title: '',
      alternativeTitle: '',
      id: '',
      poster: '',
      type: '',
      duration: '',
      episodes: {
        sub: 0,
        dub: 0,
        eps: 0,
      },
      is18Plus: false,
    };
    const titleEl = $(el).find('.film-detail .film-name .dynamic-name');
    innerObj.title = titleEl.text() || '';
    innerObj.alternativeTitle = titleEl.attr('data-jname') || '';
    innerObj.id = titleEl.attr('href')?.split('/').pop() || '';
    innerObj.type = $(el).find('.fd-infor .fdi-item').first().text() || '';
    innerObj.duration = $(el).find('.fd-infor .fdi-duration').text() || '';
    innerObj.poster = $(el).find('.film-poster .film-poster-img').attr('data-src') || '';
    innerObj.is18Plus = $(el).find('.film-poster').has('.tick-rate').length > 0;
    innerObj.episodes.sub = Number($(el).find('.film-poster .tick .tick-sub').text()) || 0;
    innerObj.episodes.dub = Number($(el).find('.film-poster .tick .tick-dub').text()) || 0;
    const epsEl = $(el).find('.film-poster .tick .tick-eps').length
      ? $(el).find('.film-poster .tick .tick-eps').text()
      : $(el).find('.film-poster .tick .tick-sub').text();
    innerObj.episodes.eps = Number(epsEl) || 0;
    obj.recommended.push(innerObj);
  });

  return obj;
};
