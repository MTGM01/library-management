import { API_Book_List } from "../../datasource/BookListAPI";

export type Category =
  | "all"
  | "computer"
  | "literature"
  | "history"
  | "sciences"
  | "story"
  | "psychology";

export interface BookProps {
  /** عنوان */
  title: string;
  /** نویسنده */
  author: string;
  /** قیمت */
  price: number;
  /** شماره شابک */
  ISBN: string;
  /** نام دسته بندی */
  category: Category;
  /** توضیحات */
  description: string;
}

export class Book {
  /** عنوان کتاب */
  public title: string;

  /** نویسنده کتاب */
  public author: string;

  /** قیمت کتاب */
  public price: number;

  /** شماره شابک */
  public ISBN: string;

  /** دسته‌بندی کتاب */
  public category: Category;

  /** توضیحات کتاب */
  public description: string;

  /** تاریخ ایجاد (برای مدیریت داخلی) */
  public createdAt: Date;

  /** آخرین تاریخ بروزرسانی */
  public updatedAt: Date;

  /** شناسه یکتا (برای دیتابیس) */
  public id?: string;

  constructor(bookData: {
    title: string;
    author: string;
    price: number;
    ISBN: string;
    category: Category;
    description: string;
    id?: string;
  }) {
    this.title = bookData.title;
    this.author = bookData.author;
    this.price = bookData.price;
    this.ISBN = bookData.ISBN;
    this.category = bookData.category;
    this.description = bookData.description;
    this.id = bookData.id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /** بروزرسانی اطلاعات کتاب */
  update(
    updateData: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>,
  ): void {
    Object.assign(this, updateData);
    this.updatedAt = new Date();
  }

  static getList(category: Category) {
    return API_Book_List({ category });
  }

  /** دریافت قیمت با فرمت مناسب */
  public getFormattedPrice(): string {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
      minimumFractionDigits: 0,
    }).format(this.price);
  }

  /** دریافت خلاصه توضیحات */
  public getShortDescription(maxLength: number = 100): string {
    if (this.description.length <= maxLength) {
      return this.description;
    }
    return this.description.substring(0, maxLength) + "...";
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
      price: this.price,
      ISBN: this.ISBN,
      category: this.category,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /** ایجاد کتاب از روی شیء (مثلاً از دیتابیس) */
  public static fromJSON(json: any): Book {
    const book = new Book({
      title: json.title,
      author: json.author,
      price: json.price,
      ISBN: json.ISBN,
      category: json.category,
      description: json.description,
      id: json.id,
    });

    // بازیابی تاریخ‌ها اگر وجود داشته باشند
    if (json.createdAt) {
      book.createdAt = new Date(json.createdAt);
    }
    if (json.updatedAt) {
      book.updatedAt = new Date(json.updatedAt);
    }

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

    if (this.price <= 0) {
      errors.push("قیمت باید بزرگتر از صفر باشد");
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

  /** کلون کردن کتاب */
  public clone(): Book {
    return Book.fromJSON(this.toJSON());
  }
}
