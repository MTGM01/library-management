import {
  API_User_Login,
  type API_User_Login_Input,
} from "../datasource/LoginAPI";

export type UserRole = "ADMIN" | "USER";

export interface UserProps {
  /** نام کاربری */
  userName: string;
  /** پسورد */
  password: string;
  /** شماره موبایل */
  mobile: string;
  /** مبلغ جریمه */
  crime: number;
  /** نقش */
  role: UserRole;
  /** لیست کتاب های رزرو شده */
  reservedBooks: Array<any>;
}

export class User {
  /** نام کاربری */
  public userName: string;

  /** پسورد (توجه: در برنامه واقعی هرگز پسورد را به صورت plain ذخیره نکنید) */
  private _password: string;

  /** شماره موبایل */
  public mobile: string;

  /** مبلغ جریمه */
  public crime: number;

  /** نقش کاربر */
  public role: UserRole;

  /** لیست کتاب های رزرو شده */
  public reservedBooks: Array<any>;

  /** تاریخ ایجاد حساب */
  public createdAt: Date;

  /** آخرین بروزرسانی */
  public updatedAt: Date;

  /** شناسه یکتا */
  public id?: string;

  /** وضعیت فعال بودن حساب */
  public isActive: boolean = true;

  /** تاریخ آخرین ورود */
  public lastLogin?: Date;

  constructor(userData: {
    userName: string;
    password: string;
    mobile: string;
    crime?: number;
    role: UserRole;
    reservedBooks?: Array<any>;
    id?: string;
  }) {
    this.userName = userData.userName;
    this._password = userData.password; // در عمل باید هش شود
    this.mobile = userData.mobile;
    this.crime = userData.crime || 0;
    this.role = userData.role;
    this.reservedBooks = userData.reservedBooks || [];
    this.id = userData.id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /** دریافت پسورد (با احتیاط استفاده شود) */
  public getPassword(): string {
    return this._password;
  }

  static login(body: API_User_Login_Input) {
    return API_User_Login(body);
  }

  /** تنظیم پسورد جدید */
  public setPassword(newPassword: string): void {
    // اینجا می‌توانید اعتبارسنجی و هش کردن پسورد را انجام دهید
    if (this.isValidPassword(newPassword)) {
      this._password = newPassword;
      this.updatedAt = new Date();
    } else {
      throw new Error("پسورد باید حداقل ۸ کاراکتر و شامل حرف و عدد باشد");
    }
  }

  /** بررسی اعتبار پسورد */
  private isValidPassword(password: string): boolean {
    return (
      password.length >= 8 &&
      /[a-zA-Z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  /** بررسی تطابق پسورد */
  public verifyPassword(password: string): boolean {
    // در عمل باید هش شده را مقایسه کنید
    return this._password === password;
  }

  /** افزودن کتاب به لیست رزرو شده */
  public reserveBook(book: any): void {
    if (!this.reservedBooks.some((b) => b.id === book.id)) {
      this.reservedBooks.push(book);
      this.updatedAt = new Date();
    }
  }

  /** حذف کتاب از لیست رزرو شده */
  public cancelReservation(bookId: string): void {
    this.reservedBooks = this.reservedBooks.filter(
      (book) => book.id !== bookId,
    );
    this.updatedAt = new Date();
  }

  /** بررسی وجود کتاب در لیست رزرو شده */
  public hasReservedBook(bookId: string): boolean {
    return this.reservedBooks.some((book) => book.id === bookId);
  }

  /** دریافت تعداد کتاب‌های رزرو شده */
  public getReservedBooksCount(): number {
    return this.reservedBooks.length;
  }

  /** افزایش جریمه */
  public addCrime(amount: number): void {
    if (amount > 0) {
      this.crime += amount;
      this.updatedAt = new Date();
    }
  }

  /** پرداخت جریمه */
  public payCrime(amount: number): void {
    if (amount > 0 && amount <= this.crime) {
      this.crime -= amount;
      this.updatedAt = new Date();
    } else {
      throw new Error("مبلغ پرداختی معتبر نیست");
    }
  }

  /** بررسی وضعیت بدهی */
  public hasDebt(): boolean {
    return this.crime > 0;
  }

  /** دریافت مبلغ جریمه به صورت فرمت شده */
  public getFormattedCrime(): string {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
      minimumFractionDigits: 0,
    }).format(this.crime);
  }

  /** به‌روزرسانی آخرین ورود */
  public updateLastLogin(): void {
    this.lastLogin = new Date();
  }

  /** غیرفعال کردن حساب */
  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /** فعال کردن حساب */
  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  /** اعتبارسنجی شماره موبایل */
  public isValidMobile(): boolean {
    const mobileRegex = /^09[0-9]{9}$/;
    return mobileRegex.test(this.mobile);
  }

  /** دریافت اطلاعات کاربر به صورت امن (بدون پسورد) */
  public getSafeInfo(): object {
    return {
      id: this.id,
      userName: this.userName,
      mobile: this.mobile,
      role: this.role,
      crime: this.crime,
      reservedBooks: this.reservedBooks,
      createdAt: this.createdAt,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
    };
  }

  /** دریافت اطلاعات کامل برای مدیریت */
  public toJSON(): object {
    return {
      id: this.id,
      userName: this.userName,
      mobile: this.mobile,
      role: this.role,
      crime: this.crime,
      reservedBooks: this.reservedBooks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
    };
  }

  /** ایجاد کاربر از روی JSON */
  public static fromJSON(json: any): User {
    const user = new User({
      userName: json.userName,
      password: json._password || json.password || "", // در عمل پسورد هش شده است
      mobile: json.mobile,
      crime: json.crime,
      role: json.role,
      reservedBooks: json.reservedBooks || [],
      id: json.id,
    });

    // بازیابی اطلاعات اضافی
    if (json.createdAt) user.createdAt = new Date(json.createdAt);
    if (json.updatedAt) user.updatedAt = new Date(json.updatedAt);
    if (json.lastLogin) user.lastLogin = new Date(json.lastLogin);
    if (json.isActive !== undefined) user.isActive = json.isActive;

    return user;
  }

  /** جستجو در کاربران */
  public matchesSearch(query: string): boolean {
    const searchTerm = query.toLowerCase().trim();
    return (
      this.userName.toLowerCase().includes(searchTerm) ||
      this.mobile.includes(searchTerm)
    );
  }

  /** اعتبارسنجی اطلاعات کاربر */
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.userName || this.userName.trim().length < 3) {
      errors.push("نام کاربری باید حداقل ۳ کاراکتر باشد");
    }

    if (!this.isValidMobile()) {
      errors.push(
        "شماره موبایل معتبر نیست (باید با 09 شروع شود و 11 رقم باشد)",
      );
    }

    if (this.crime < 0) {
      errors.push("مبلغ جریمه نمی‌تواند منفی باشد");
    }

    if (!this.role) {
      errors.push("نقش کاربر باید مشخص شود");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /** کلون کردن کاربر */
  public clone(): User {
    return User.fromJSON(this.toJSON());
  }
}
