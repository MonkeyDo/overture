import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'moment';

// Entity to summary for visualisation

@Pipe({ name: 'summary' })
export class SummaryPipe implements PipeTransform {
  transform(value, eclass: string): any {

    switch (eclass) {
      case 'expression':
        return {
          id: value.id,
          link: ['/expression', value.id],
          title: value.title,
          super: value.composer,
          small: value.catalogue
        }
      case 'event':
      case 'http://data.doremus.org/ontology#M42_Performed_Expression_Creation':
      case 'http://erlangen-crm.org/efrbroo/F31_Performance':
        return {
          super: `${value.time ? moment(value.time).year() : ''}${separator(value)}${toActorList(value.activities)}`,
          title: value.place ? `Performance at ${value.place}` : 'Performance'
        }
      case 'http://erlangen-crm.org/efrbroo/F30_Publication_Event':
        return {
          super: `${value.time ? moment(value.time).year(): ''}${separator(value)}${toActorList(value.activities)}`,
          title: value.place ? `Publication at ${value.place}` : 'Publication'
        }

    }

  }
}

function separator(value) {
  return value.time && value.activities ? ', ' : '';
}
function toActorList(activities = []) {
  return activities.map(a => a.actor).join(', ');
}