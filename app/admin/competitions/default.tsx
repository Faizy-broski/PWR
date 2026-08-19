// The `new` and `[id]` competition forms exist only as modals (see @modal/)
// — there's no dedicated page for those segments under `children` anymore.
// This renders the list underneath whenever `children` has nothing to match
// against those URLs (hard reload of /admin/competitions/new, a bookmarked
// edit link, or navigating in from outside this section), so the modal
// always has the list page behind it instead of a blank slot or a 404.
export { default } from "./page";
