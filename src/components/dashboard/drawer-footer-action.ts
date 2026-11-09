// ---------------------------------------------------------------------------
// Drawer footer action — the bottom button of every dashboard drawer
// ---------------------------------------------------------------------------
//
// A full-bleed, tall, brand-yellow button pinned to the bottom of a Sheet
// (quick views' "View Details", form drawers' "Create" / "Save", media
// "Upload"). Pair it with a padding-free footer:
//
//   <SheetFooter className={drawerFooterClassName}>
//     <Button className={drawerFooterActionClassName}>…</Button>
//   </SheetFooter>

const drawerFooterClassName = "gap-0 p-0";

const drawerFooterActionClassName =
  "h-14 w-full rounded-none bg-warning text-base text-black hover:bg-warning/85";

export { drawerFooterActionClassName, drawerFooterClassName };
