import {
  API_Add_New_Book,
  type API_Add_Book_Input,
} from "../datasource/AddBookAPI";
import { API_Book_List } from "../datasource/BookListAPI";
import {
  API_Remove_Book,
  type API_Remove_Book_Input,
} from "../datasource/DeleteBookAPI";
import {
  API_Update_Book,
  type API_Update_Book_Input,
} from "../datasource/UpdateBookAPI";

export type Category =
  | "all"
  | "computer"
  | "literature"
  | "history"
  | "sciences"
  | "story"
  | "psychology";

export type CategoryEnum = { title: string; value: Category };

export interface BookProps {
  /** شناسه کتاب */
  _id: string;
  /** عنوان */
  title: string;
  /** نویسنده */
  author: string;
  /** شماره شابک */
  ISBN: string;
  /** نام دسته بندی */
  category: Category;
  /** تعداد کل نسخه */
  total: number;
  /** تعداد نسخه های موجود */
  availableCount: number;
  /** توضیحات */
  description: string;
}

export const booksCategories: CategoryEnum[] = [
  {
    title: "همه",
    value: "all",
  },
  {
    title: "کامپیوتر",
    value: "computer",
  },
  {
    title: "ادبیات",
    value: "literature",
  },
  {
    title: "تاریخ",
    value: "history",
  },
  {
    title: "علوم",
    value: "sciences",
  },
  {
    title: "داستان",
    value: "story",
  },
  {
    title: "روانشناسی",
    value: "psychology",
  },
];

export class Book {
  /** عنوان کتاب */
  public title: string;

  /** نویسنده کتاب */
  public author: string;

  /** شماره شابک */
  public ISBN: string;

  /** دسته‌بندی کتاب */
  public category: Category;

  /** تعداد کل نسخه ها */
  public total: number;

  /** تعداد نسخه های موجود */
  public availableCount: number;

  /** توضیحات کتاب */
  public description: string;

  /** تاریخ ایجاد (برای مدیریت داخلی) */
  public createdAt: Date;

  /** آخرین تاریخ بروزرسانی */
  public updatedAt: Date;

  /** شناسه یکتا (برای دیتابیس) */
  public id: string;

  constructor(bookData: {
    title: string;
    author: string;
    ISBN: string;
    category: Category;
    description: string;
    total: number;
    availableCount: number;
    _id: string;
  }) {
    this.id = bookData._id;
    this.title = bookData.title;
    this.author = bookData.author;
    this.ISBN = bookData.ISBN;
    this.category = bookData.category;
    this.total = bookData.total;
    this.availableCount = bookData.availableCount;
    this.description = bookData.description;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static getList(category: Category) {
    return API_Book_List({ category });
  }

  static add(book: API_Add_Book_Input) {
    return API_Add_New_Book(book);
  }

  update(book: API_Update_Book_Input) {
    return API_Update_Book(book);
  }

  remove(id: API_Remove_Book_Input) {
    return API_Remove_Book(id);
  }

  /** بررسی اعتبار شابک (الگوریتم ساده) */
  public isValidISBN(): boolean {
    // حذف خط تیره و فاصله
    const cleanISBN = this.ISBN.replace(/[-\s]/g, "");

    // بررسی طول شابک (10 یا 13 رقمی)
    return cleanISBN.length === 10 || cleanISBN.length === 13;
  }

  /** دریافت اطلاعات کامل کتاب به صورت شیء */
  public toJSON(): object {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      ISBN: this.ISBN,
      category: this.category,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /** ایجاد کتاب از روی شیء (مثلاً از دیتابیس) */
  public static fromJSON(json: BookProps): Book {
    const book = new Book({
      title: json.title,
      author: json.author,
      ISBN: json.ISBN,
      category: json.category,
      total: json.total,
      availableCount: json.availableCount,
      description: json.description,
      _id: json._id,
    });

    return book;
  }

  /** جستجو در کتاب (بررسی وجود متن در عنوان، نویسنده یا توضیحات) */
  public matchesSearch(query: string): boolean {
    const searchTerm = query.toLowerCase().trim();
    return (
      this.title.toLowerCase().includes(searchTerm) ||
      this.author.toLowerCase().includes(searchTerm) ||
      this.description.toLowerCase().includes(searchTerm) ||
      this.ISBN.includes(searchTerm)
    );
  }

  /** اعتبارسنجی اطلاعات کتاب */
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.title || this.title.trim().length < 1) {
      errors.push("عنوان کتاب نمی‌تواند خالی باشد");
    }

    if (!this.author || this.author.trim().length < 1) {
      errors.push("نویسنده کتاب نمی‌تواند خالی باشد");
    }

    if (!this.ISBN || !this.isValidISBN()) {
      errors.push("شابک معتبر نیست (باید 10 یا 13 رقم باشد)");
    }

    if (!this.category) {
      errors.push("دسته‌بندی باید انتخاب شود");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
