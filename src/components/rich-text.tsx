import { cloneElement, isValidElement, type ComponentProps } from "react";
import {
  RichText as PayloadRichText,
  type JSXConverter,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";

import { EXTERNAL_LINK_REL, isExternalHref } from "@/lib/external-link";

// Wraps a default link converter so links to other sites get EXTERNAL_LINK_REL
// on top of whatever Payload renders (href, newTab → target="_blank").
function withExternalRel<T extends { type: string }>(
  converter: JSXConverter<T> | undefined,
): JSXConverter<T> | undefined {
  if (typeof converter !== "function") return converter;
  return (args) => {
    const element = converter(args);
    if (
      isValidElement<{ href?: string; rel?: string }>(element) &&
      isExternalHref(element.props.href)
    ) {
      return cloneElement(element, { rel: EXTERNAL_LINK_REL });
    }
    return element;
  };
}

type RichTextProps = Omit<ComponentProps<typeof PayloadRichText>, "converters"> & {
  converters?: JSXConvertersFunction<DefaultNodeTypes>;
};

/**
 * Payload's RichText with external links marked nofollow. Use this instead
 * of importing RichText from @payloadcms/richtext-lexical/react directly.
 */
const RichText = ({ converters, ...props }: RichTextProps) => {
  const withRel: JSXConvertersFunction<DefaultNodeTypes> = (args) => {
    const base = converters ? converters(args) : args.defaultConverters;
    return {
      ...base,
      link: withExternalRel(base.link),
      autolink: withExternalRel(base.autolink),
    };
  };

  return <PayloadRichText converters={withRel} {...props} />;
};

export { RichText };
