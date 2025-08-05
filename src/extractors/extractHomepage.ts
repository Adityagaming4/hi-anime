import { load } from 'cheerio';

interface SpotlightAnime {
  title: string;
  alternativeTitle: string;
  id: string;
  poster: string;
  rank: number;
  type: string;
  quality: string;
  duration: string;
  aired: string;
  synopsis: string;
  episodes: {
    sub: number;
    dub: number;
    eps: number;
  };
}

interface TrendingAnime {
  title: string;
  alternativeTitle: string;
  rank: number;
  poster: string;
  id: string;
}

interface BasicAnime {
  title: string;
  alternativeTitle: string;
  id: string;
  poster: string;
  episodes: {
    sub: number;
    dub: number;
    eps: number;
  };
}

interface FeaturedAnime extends BasicAnime {
  type: string;
}

interface TopAnime extends BasicAnime {
  rank: number;
}

interface HomepageData {
  spotlight: SpotlightAnime[];
  trending: TrendingAnime[];
  topAiring: FeaturedAnime[];
  mostPopular: FeaturedAnime[];
  mostFavorite: FeaturedAnime[];
  latestCompleted: BasicAnime[];
  latestEpisode: BasicAnime[];
  newAdded: BasicAnime[];
  topUpcoming: FeaturedAnime[];
  top10: {
    today: TopAnime[];
    week: TopAnime[];
    month: TopAnime[];
  };
  genres: string[];
}

export const extractHomepage = (html: string): HomepageData => {
  const $ = load(html);

  const response: HomepageData = {
    spotlight: [],
    trending: [],
    topAiring: [],
    mostPopular: [],
    mostFavorite: [],
    latestCompleted: [],
    latestEpisode: [],
    newAdded: [],
    topUpcoming: [],
    top10: {
      today: [],
      week: [],
      month: [],
    },
    genres: [],
  };

  const $spotlight = $('.deslide-wrap .swiper-wrapper .swiper-slide');
  const $trending = $('#trending-home .swiper-container .swiper-slide');
  const $featured = $('#anime-featured .anif-blocks .row .anif-block');
  const $home = $('.block_area.block_area_home');
  const $top10 = $('.block_area .cbox');
  const $genres = $('.sb-genre-list');

  // Extract spotlight
  $spotlight.each((i, el) => {
    const obj: SpotlightAnime = {
      title: '',
      alternativeTitle: '',
      id: '',
      poster: '',
      rank: i + 1,
      type: '',
      quality: '',
      duration: '',
      aired: '',
      synopsis: '',
      episodes: {
        sub: 0,
        dub: 0,
        eps: 0,
      },
    };

    obj.id = $(el).find('.desi-buttons a').first().attr('href')?.split('/').at(-1) || '';
    obj.poster = $(el).find('.deslide-cover .film-poster-img').attr('data-src') || '';

    const titles = $(el).find('.desi-head-title');
    obj.title = titles.text() || '';
    obj.alternativeTitle = titles.attr('data-jname') || '';

    obj.synopsis = $(el).find('.desi-description').text().trim() || '';

    const details = $(el).find('.sc-detail');
    obj.type = details.find('.scd-item').eq(0).text().trim() || '';
    obj.duration = details.find('.scd-item').eq(1).text().trim() || '';
    obj.aired = details.find('.scd-item.m-hide').text().trim() || '';
    obj.quality = details.find('.scd-item .quality').text().trim() || '';

    obj.episodes.sub = Number(details.find('.tick-sub').text().trim()) || 0;
    obj.episodes.dub = Number(details.find('.tick-dub').text().trim()) || 0;

    const epsText = details.find('.tick-eps').length
      ? details.find('.tick-eps').text().trim()
      : details.find('.tick-sub').text().trim();
    obj.episodes.eps = Number(epsText) || 0;

    response.spotlight.push(obj);
  });

  // Extract trending
  $trending.each((i, el) => {
    const obj: TrendingAnime = {
      title: '',
      alternativeTitle: '',
      rank: i + 1,
      poster: '',
      id: '',
    };

    const titleEl = $(el).find('.item .film-title');
    obj.title = titleEl.text() || '';
    obj.alternativeTitle = titleEl.attr('data-jname') || '';

    const imageEl = $(el).find('.film-poster');
    obj.poster = imageEl.find('img').attr('data-src') || '';
    obj.id = imageEl.attr('href')?.split('/').at(-1) || '';

    response.trending.push(obj);
  });

  // Extract featured sections
  $featured.each((i, el) => {
    const data = $(el)
      .find('.anif-block-ul ul li')
      .map((index, item) => {
        const obj: FeaturedAnime = {
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

        const titleEl = $(item).find('.film-detail .film-name a');
        obj.title = titleEl.attr('title') || '';
        obj.alternativeTitle = titleEl.attr('data-jname') || '';
        obj.id = titleEl.attr('href')?.split('/').at(-1) || '';

        obj.poster = $(item).find('.film-poster .film-poster-img').attr('data-src') || '';
        obj.type = $(item).find('.fd-infor .fdi-item').text() || '';

        obj.episodes.sub = Number($(item).find('.fd-infor .tick-sub').text()) || 0;
        obj.episodes.dub = Number($(item).find('.fd-infor .tick-dub').text()) || 0;

        const epsText = $(item).find('.fd-infor .tick-eps').length
          ? $(item).find('.fd-infor .tick-eps').text()
          : $(item).find('.fd-infor .tick-sub').text();

        obj.episodes.eps = Number(epsText) || 0;

        return obj;
      })
      .get();

    const dataType = $(el).find('.anif-block-header').text().replace(/\s+/g, '');
    const normalizedDataType = dataType.charAt(0).toLowerCase() + dataType.slice(1);

    if (normalizedDataType === 'topAiring') {
      response.topAiring = data;
    } else if (normalizedDataType === 'mostPopular') {
      response.mostPopular = data;
    } else if (normalizedDataType === 'mostFavorite') {
      response.mostFavorite = data;
    } else if (normalizedDataType === 'topUpcoming') {
      response.topUpcoming = data;
    }
  });

  // Extract home sections
  $home.each((i, el) => {
    const data = $(el)
      .find('.tab-content .film_list-wrap .flw-item')
      .map((index, item) => {
        const obj: BasicAnime = {
          title: '',
          alternativeTitle: '',
          id: '',
          poster: '',
          episodes: {
            sub: 0,
            dub: 0,
            eps: 0,
          },
        };

        const titleEl = $(item).find('.film-detail .film-name .dynamic-name');
        obj.title = titleEl.attr('title') || '';
        obj.alternativeTitle = titleEl.attr('data-jname') || '';
        obj.id = titleEl.attr('href')?.split('/').at(-1) || '';

        obj.poster = $(item).find('.film-poster img').attr('data-src') || '';

        const episodesEl = $(item).find('.film-poster .tick');
        obj.episodes.sub = Number(episodesEl.find('.tick-sub').text()) || 0;
        obj.episodes.dub = Number(episodesEl.find('.tick-dub').text()) || 0;

        const epsText = episodesEl.find('.tick-eps').length
          ? episodesEl.find('.tick-eps').text()
          : episodesEl.find('.tick-sub').text();

        obj.episodes.eps = Number(epsText) || 0;

        return obj;
      })
      .get();

    const dataType = $(el).find('.cat-heading').text().replace(/\s+/g, '');
    const normalizedDataType = dataType.charAt(0).toLowerCase() + dataType.slice(1);

    if (normalizedDataType === 'newOnHiAnime') {
      response.newAdded = data;
    } else if (normalizedDataType === 'latestCompleted') {
      response.latestCompleted = data;
    } else if (normalizedDataType === 'latestEpisode') {
      response.latestEpisode = data;
    }
  });

  // Extract top 10
  const extractTopTen = (id: string): TopAnime[] => {
    return $top10
      .find(`${id} ul li`)
      .map((i, el) => {
        const obj: TopAnime = {
          title: $(el).find('.film-name a').text() || '',
          rank: i + 1,
          alternativeTitle: $(el).find('.film-name a').attr('data-jname') || '',
          id: $(el).find('.film-name a').attr('href')?.split('/').pop() || '',
          poster: $(el).find('.film-poster img').attr('data-src') || '',
          episodes: {
            sub: Number($(el).find('.tick-item.tick-sub').text()) || 0,
            dub: Number($(el).find('.tick-item.tick-dub').text()) || 0,
            eps: $(el).find('.tick-item.tick-eps').length
              ? Number($(el).find('.tick-item.tick-eps').text()) || 0
              : Number($(el).find('.tick-item.tick-sub').text()) || 0,
          },
        };
        return obj;
      })
      .get();
  };

  response.top10.today = extractTopTen('#top-viewed-day');
  response.top10.week = extractTopTen('#top-viewed-week');
  response.top10.month = extractTopTen('#top-viewed-month');

  // Extract genres
  $genres.find('li').each((i, el) => {
    const genre = $(el).find('a').attr('title')?.toLowerCase() || '';
    if (genre) {
      response.genres.push(genre);
    }
  });

  return response;
};
