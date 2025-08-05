import { load } from 'cheerio';
import { SearchResponse, HiAnimeSearchResult } from '../types';

export const extractListPage = (html: string): SearchResponse => {
  const $ = load(html);

  const response: HiAnimeSearchResult[] = [];
  const hasData = $('.block_area-content.block_area-list.film_list .film_list-wrap .flw-item');
  
  if (hasData.length < 1) {
    return {
      pageInfo: {
        currentPage: 1,
        hasNextPage: false,
        totalPages: 1,
      },
      response: [],
    };
  }

  $('.block_area-content.block_area-list.film_list .film_list-wrap .flw-item').each((i, el) => {
    const obj: HiAnimeSearchResult = {
      title: '',
      alternativeTitle: '',
      id: '',
      poster: '',
      episodes: { sub: 0, dub: 0, eps: 0 },
      type: '',
      duration: '',
    };

    obj.poster = $(el).find('.film-poster .film-poster-img').attr('data-src') || '';
    obj.episodes.sub = Number($(el).find('.film-poster .tick .tick-sub').text()) || 0;
    obj.episodes.dub = Number($(el).find('.film-poster .tick .tick-dub').text()) || 0;

    const epsEl = $(el).find('.film-poster .tick .tick-eps').length
      ? $(el).find('.film-poster .tick .tick-eps').text()
      : $(el).find('.film-poster .tick .tick-sub').text();
    obj.episodes.eps = Number(epsEl) || 0;

    const titleEL = $(el).find('.film-detail .film-name .dynamic-name');
    obj.title = titleEL.text();
    obj.alternativeTitle = titleEL.attr('data-jname') || '';
    obj.id = titleEL.attr('href')?.split('/').at(-1) || '';

    obj.type = $(el).find('.fd-infor .fdi-item').first().text();
    obj.duration = $(el).find('.fd-infor .fdi-duration').text();

    response.push(obj);
  });

  const paginationEl = $('.pre-pagination .pagination .page-item');
  let currentPage, hasNextPage, totalPages;
  
  if (!paginationEl.length) {
    currentPage = 1;
    hasNextPage = false;
    totalPages = 1;
  } else {
    currentPage = Number(paginationEl.find('.active .page-link').text());
    hasNextPage = !paginationEl.last().hasClass('active');
    totalPages = hasNextPage
      ? Number(paginationEl.last().find('.page-link').attr('href')?.split('page=').at(-1))
      : Number(paginationEl.last().find('.page-link').text());
  }

  return { pageInfo: { totalPages, currentPage, hasNextPage }, response };
};
