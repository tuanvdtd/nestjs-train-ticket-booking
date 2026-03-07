import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  username: string;
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
  @IsNotEmpty({ message: 'Email is required' })
    // Sử dụng @IsEmail để đảm bảo rằng email phải là một địa chỉ email hợp lệ, nó có 2 tham số: một object rỗng {} để cấu hình các tùy chọn (ở đây chúng ta không cần cấu hình gì thêm) và một object chứa message để tùy chỉnh thông báo lỗi khi email không hợp lệ., 
    // object rỗng {} là một đối tượng cấu hình cho validator, ví dụ như bạn có thể cấu hình để cho phép email có dấu chấm ở cuối hoặc không, hoặc để cho phép email có dấu cộng (+) trong phần local của địa chỉ email. ví dụ @IsEmail({ allow_dot_at_end: true, allow_plus_sign: true }, { message: 'Email must be a valid email address' }) => đây là một ví dụ về cách sử dụng @IsEmail với các tùy chọn cấu hình để cho phép email có dấu chấm ở cuối và dấu cộng trong phần local của địa chỉ email. Nếu bạn không cần cấu hình gì thêm, bạn có thể chỉ cần truyền một object rỗng {} như trong ví dụ ban đầu.
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}
