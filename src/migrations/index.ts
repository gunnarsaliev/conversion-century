import * as migration_20261022_070643_initial from './20261022_070643_initial';
import * as migration_20261022_071306_contacts from './20261022_071306_contacts';
import * as migration_20261022_074025_contact_status from './20261022_074025_contact_status';
import * as migration_20261026_092426_seo_meta_and_redirects from './20261026_092426_seo_meta_and_redirects';
import * as migration_20261027_131524_user_slug from './20261027_131524_user_slug';

export const migrations = [
  {
    up: migration_20261022_070643_initial.up,
    down: migration_20261022_070643_initial.down,
    name: '20261022_070643_initial',
  },
  {
    up: migration_20261022_071306_contacts.up,
    down: migration_20261022_071306_contacts.down,
    name: '20261022_071306_contacts',
  },
  {
    up: migration_20261022_074025_contact_status.up,
    down: migration_20261022_074025_contact_status.down,
    name: '20261022_074025_contact_status',
  },
  {
    up: migration_20261026_092426_seo_meta_and_redirects.up,
    down: migration_20261026_092426_seo_meta_and_redirects.down,
    name: '20261026_092426_seo_meta_and_redirects',
  },
  {
    up: migration_20261027_131524_user_slug.up,
    down: migration_20261027_131524_user_slug.down,
    name: '20261027_131524_user_slug'
  },
];
