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
import * as migration_20261102_125233_industries_content_fields from './20261102_125233_industries_content_fields';
import * as migration_20261102_134333_industries_how_we_help_heading from './20261102_134333_industries_how_we_help_heading';
import * as migration_20261109_153339_mcp_api_keys from './20261109_153339_mcp_api_keys';
import * as migration_20261110_120512_ai_chats from './20261110_120512_ai_chats';
import * as migration_20261112_111449_home_about_pages from './20261112_111449_home_about_pages';
import * as migration_20261119_144523_blog_faqs from './20261119_144523_blog_faqs';
import * as migration_20261119_150743_blog_faq_answer_richtext from './20261119_150743_blog_faq_answer_richtext';
import * as migration_20261123_104630_faqs from './20261123_104630_faqs';
import * as migration_20261123_110210_faq_categories from './20261123_110210_faq_categories';
import * as migration_20261123_110645_faqs_questions_array from './20261123_110645_faqs_questions_array';
import * as migration_20261123_110948_faq_remove_order from './20261123_110948_faq_remove_order';
import * as migration_20261123_111438_faq_description_meta from './20261123_111438_faq_description_meta';
import * as migration_20261123_112520_faq_image_seo_tab from './20261123_112520_faq_image_seo_tab';
import * as migration_20261123_120327_faq_category_slug from './20261123_120327_faq_category_slug';
import * as migration_20261123_122020_faqs_page_meta from './20261123_122020_faqs_page_meta';
import * as migration_20261123_123805_faqs_slug_remove_categories from './20261123_123805_faqs_slug_remove_categories';

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
    name: '20261030_142041_testimonials_rating_default',
  },
  {
    up: migration_20261102_125233_industries_content_fields.up,
    down: migration_20261102_125233_industries_content_fields.down,
    name: '20261102_125233_industries_content_fields',
  },
  {
    up: migration_20261102_134333_industries_how_we_help_heading.up,
    down: migration_20261102_134333_industries_how_we_help_heading.down,
    name: '20261102_134333_industries_how_we_help_heading',
  },
  {
    up: migration_20261109_153339_mcp_api_keys.up,
    down: migration_20261109_153339_mcp_api_keys.down,
    name: '20261109_153339_mcp_api_keys',
  },
  {
    up: migration_20261110_120512_ai_chats.up,
    down: migration_20261110_120512_ai_chats.down,
    name: '20261110_120512_ai_chats',
  },
  {
    up: migration_20261112_111449_home_about_pages.up,
    down: migration_20261112_111449_home_about_pages.down,
    name: '20261112_111449_home_about_pages',
  },
  {
    up: migration_20261119_144523_blog_faqs.up,
    down: migration_20261119_144523_blog_faqs.down,
    name: '20261119_144523_blog_faqs',
  },
  {
    up: migration_20261119_150743_blog_faq_answer_richtext.up,
    down: migration_20261119_150743_blog_faq_answer_richtext.down,
    name: '20261119_150743_blog_faq_answer_richtext',
  },
  {
    up: migration_20261123_104630_faqs.up,
    down: migration_20261123_104630_faqs.down,
    name: '20261123_104630_faqs',
  },
  {
    up: migration_20261123_110210_faq_categories.up,
    down: migration_20261123_110210_faq_categories.down,
    name: '20261123_110210_faq_categories',
  },
  {
    up: migration_20261123_110645_faqs_questions_array.up,
    down: migration_20261123_110645_faqs_questions_array.down,
    name: '20261123_110645_faqs_questions_array',
  },
  {
    up: migration_20261123_110948_faq_remove_order.up,
    down: migration_20261123_110948_faq_remove_order.down,
    name: '20261123_110948_faq_remove_order',
  },
  {
    up: migration_20261123_111438_faq_description_meta.up,
    down: migration_20261123_111438_faq_description_meta.down,
    name: '20261123_111438_faq_description_meta',
  },
  {
    up: migration_20261123_112520_faq_image_seo_tab.up,
    down: migration_20261123_112520_faq_image_seo_tab.down,
    name: '20261123_112520_faq_image_seo_tab',
  },
  {
    up: migration_20261123_120327_faq_category_slug.up,
    down: migration_20261123_120327_faq_category_slug.down,
    name: '20261123_120327_faq_category_slug',
  },
  {
    up: migration_20261123_122020_faqs_page_meta.up,
    down: migration_20261123_122020_faqs_page_meta.down,
    name: '20261123_122020_faqs_page_meta',
  },
  {
    up: migration_20261123_123805_faqs_slug_remove_categories.up,
    down: migration_20261123_123805_faqs_slug_remove_categories.down,
    name: '20261123_123805_faqs_slug_remove_categories'
  },
];
