import * as migration_20261022_070643_initial from './20261022_070643_initial';
import * as migration_20261022_071306_contacts from './20261022_071306_contacts';
import * as migration_20261022_074025_contact_status from './20261022_074025_contact_status';
import * as migration_20261026_092426_seo_meta_and_redirects from './20261026_092426_seo_meta_and_redirects';
import * as migration_20261027_131524_user_slug from './20261027_131524_user_slug';
import * as migration_20261027_135858_checklist_item_service from './20261027_135858_checklist_item_service';
import * as migration_20261027_141308_checklist_item_trim_fields from './20261027_141308_checklist_item_trim_fields';
import * as migration_20261027_144159_client_progress_not_started from './20261027_144159_client_progress_not_started';
import * as migration_20261028_083000_blog_category_checklists from './20261028_083000_blog_category_checklists';
import * as migration_20261029_081442_seo_fields_2026 from './20261029_081442_seo_fields_2026';
import * as migration_20261030_140046_contacts_client_optional from './20261030_140046_contacts_client_optional';
import * as migration_20261030_140921_testimonials_rating_date from './20261030_140921_testimonials_rating_date';
import * as migration_20261030_141122_testimonials_source_optional_text from './20261030_141122_testimonials_source_optional_text';
import * as migration_20261030_141347_testimonials_drop_client_type from './20261030_141347_testimonials_drop_client_type';
import * as migration_20261030_142041_testimonials_rating_default from './20261030_142041_testimonials_rating_default';

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
    name: '20261027_131524_user_slug',
  },
  {
    up: migration_20261027_135858_checklist_item_service.up,
    down: migration_20261027_135858_checklist_item_service.down,
    name: '20261027_135858_checklist_item_service',
  },
  {
    up: migration_20261027_141308_checklist_item_trim_fields.up,
    down: migration_20261027_141308_checklist_item_trim_fields.down,
    name: '20261027_141308_checklist_item_trim_fields',
  },
  {
    up: migration_20261027_144159_client_progress_not_started.up,
    down: migration_20261027_144159_client_progress_not_started.down,
    name: '20261027_144159_client_progress_not_started',
  },
  {
    up: migration_20261028_083000_blog_category_checklists.up,
    down: migration_20261028_083000_blog_category_checklists.down,
    name: '20261028_083000_blog_category_checklists',
  },
  {
    up: migration_20261029_081442_seo_fields_2026.up,
    down: migration_20261029_081442_seo_fields_2026.down,
    name: '20261029_081442_seo_fields_2026',
  },
  {
    up: migration_20261030_140046_contacts_client_optional.up,
    down: migration_20261030_140046_contacts_client_optional.down,
    name: '20261030_140046_contacts_client_optional',
  },
  {
    up: migration_20261030_140921_testimonials_rating_date.up,
    down: migration_20261030_140921_testimonials_rating_date.down,
    name: '20261030_140921_testimonials_rating_date',
  },
  {
    up: migration_20261030_141122_testimonials_source_optional_text.up,
    down: migration_20261030_141122_testimonials_source_optional_text.down,
    name: '20261030_141122_testimonials_source_optional_text',
  },
  {
    up: migration_20261030_141347_testimonials_drop_client_type.up,
    down: migration_20261030_141347_testimonials_drop_client_type.down,
    name: '20261030_141347_testimonials_drop_client_type',
  },
  {
    up: migration_20261030_142041_testimonials_rating_default.up,
    down: migration_20261030_142041_testimonials_rating_default.down,
    name: '20261030_142041_testimonials_rating_default'
  },
];
