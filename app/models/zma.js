import { computed } from '@ember-decorators/object'; // eslint-disable-line
import { attr } from '@ember-decorators/data';
import bbox from '@turf/bbox';
import Bookmarkable from './bookmark';

export default class ZoningMapAmendmentModel extends Bookmarkable {
  @attr() geometry;

  @attr('string') ulurpno;

  @attr('string') project_na;

  @attr('string') effective;

  @attr('string') status;

  @attr('string') lucats;

  @computed('effective')
  get effectiveDisplay() {
    return import('moment').then(({ default: moment }) => {
      const effective = this.get('effective');

      if (effective) {
        return moment(effective).utc().format('LL');
      }
      return 'To be determined';
    });
  }

  @computed('geometry')
  get bounds() {
    const geometry = this.get('geometry');
    return bbox(geometry);
  }
}
