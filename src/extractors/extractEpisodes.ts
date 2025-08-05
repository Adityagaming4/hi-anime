import { load } from 'cheerio';
import { Episode } from '../types';

export const extractEpisodes = (html: string): Episode[] => {
  const $ = load(html);

  const response: Episode[] = [];
  $('.ssl-item.ep-item').each((i, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';

    // Extract episode id from URL query parameter 'ep' like ?ep=12345
    const idMatch = href.match(/ep=(\d+)/);
const episodeId = idMatch?.[1] ?? '';

    const obj: Episode = {
      episodeNumber: i + 1,
      title: $el.attr('title') || '',
      alternativeTitle: $el.find('.ep-name.e-dynamic-name').attr('data-jname') || '',
      id: episodeId,
      isFiller: $el.hasClass('ssl-item-filler'),
    };

    response.push(obj);
  });
  return response;
};
