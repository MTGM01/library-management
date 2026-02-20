import type { Category } from "../repository/book";

export function convertToCategoryName(categoryValue: Category) {
  switch (categoryValue) {
    case "all":
      return "همه";
    case "computer":
      return "کامپیوتر";
    case "history":
      return "تاریخ";
    case "literature":
      return "ادبیات";
    case "psychology":
      return "روانشناسی";
    case "sciences":
      return "علوم";
    case "story":
      return "داستان";
    default:
      return "";
  }
}
