import {
  API_User_Login,
  type API_User_Login_Input,
} from "../datasource/LoginAPI";
import { showToast } from "../helper/showToast";
import { User_SetIsAuthenticated } from "./keyval/userIsAuthenticated";
import { User_SetProfile } from "./keyval/userProfile";

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
  protected userName: string;

  /** پسورد (توجه: در برنامه واقعی هرگز پسورد را به صورت plain ذخیره نکنید) */
  protected password: string;

  /** شماره موبایل */
  protected mobile: string;

  /** مبلغ جریمه */
  protected crime: number;

  /** نقش کاربر */
  protected role: UserRole;

  /** لیست کتاب های رزرو شده */
  protected reservedBooks: Array<any>;

  /** پیغام های مربوط به درخواست های شیء یوزر */
  protected message?: string;

  constructor(userData: {
    userName: string;
    password: string;
    mobile: string;
    crime?: number;
    role: UserRole;
    reservedBooks?: Array<any>;
  }) {
    this.userName = userData.userName;
    this.password = userData.password; // در عمل باید هش شود
    this.mobile = userData.mobile;
    this.crime = userData.crime || 0;
    this.role = userData.role;
    this.reservedBooks = userData.reservedBooks || [];
  }

  /** دریافت پسورد (با احتیاط استفاده شود) */
  get getPassword(): string {
    return this.password;
  }

  get userRole(): UserRole {
    return this.role;
  }

  static async login(body: API_User_Login_Input) {
    try {
      const result = await API_User_Login(body);
      User_SetIsAuthenticated(true);
      User_SetProfile({
        userName: result.result.userName,
        password: result.result.password,
        mobile: result.result.mobile,
        role: result.result.role,
        crime: result.result.crime,
        reservedBooks: result.result.reservedBooks,
      });

      if (result.message === "You are logged in successfully")
        showToast("success", "با موفقیت وارد شدید");
    } catch (error: any) {
      showToast(
        "error",
        "کاربر یافت نشد ! (نام کاربری و رمز عبور خود را با دقت وارد کنید)",
      );
      showToast("error", "اتصال به اینترنت خود را چک کنید");
      console.error(error);
    }
  }

  /** تنظیم پسورد جدید */
  public setPassword(newPassword: string): void {
    // اینجا می‌توانید اعتبارسنجی و هش کردن پسورد را انجام دهید
    if (this.isValidPassword(newPassword)) {
      this.password = newPassword;
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
    return this.password === password;
  }

  /** افزودن کتاب به لیست رزرو شده */
  public reserveBook(book: any): void {
    if (!this.reservedBooks.some((b) => b.id === book.id)) {
      this.reservedBooks.push(book);
    }
  }

  /** حذف کتاب از لیست رزرو شده */
  public cancelReservation(bookId: string): void {
    this.reservedBooks = this.reservedBooks.filter(
      (book) => book.id !== bookId,
    );
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
    }
  }

  /** پرداخت جریمه */
  public payCrime(amount: number): void {
    if (amount > 0 && amount <= this.crime) {
      this.crime -= amount;
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

  /** اعتبارسنجی شماره موبایل */
  public isValidMobile(): boolean {
    const mobileRegex = /^09[0-9]{9}$/;
    return mobileRegex.test(this.mobile);
  }

  /** دریافت اطلاعات کاربر به صورت امن (بدون پسورد) */
  public getSafeInfo(): object {
    return {
      userName: this.userName,
      mobile: this.mobile,
      role: this.role,
      crime: this.crime,
      reservedBooks: this.reservedBooks,
    };
  }

  /** دریافت اطلاعات کامل برای مدیریت */
  public toJSON(): object {
    return {
      userName: this.userName,
      mobile: this.mobile,
      role: this.role,
      crime: this.crime,
      reservedBooks: this.reservedBooks,
    };
  }

  /** ایجاد کاربر از روی JSON */
  public static fromJSON(json: any): User {
    const user = new User({
      userName: json.userName,
      password: json.password || json.password || "", // در عمل پسورد هش شده است
      mobile: json.mobile,
      crime: json.crime,
      role: json.role,
      reservedBooks: json.reservedBooks || [],
    });

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
