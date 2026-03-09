import { Controller, Get, Post, Body, Param, Delete, UploadedFile, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from './oss';
import * as fs from 'fs';
import * as path from 'path';
import { MyLogger } from 'src/log/mylogger';
import { LoginGuard } from './login.guard';
import { IsPublic } from 'src/common/login-decorator';


@Controller('user')
export class UserController {
  private logger = new MyLogger();
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @IsPublic()
  register(@Body() registerUserDto: RegisterUserDto) {
    this.logger.log('Registering user', 'UserController');
    console.log(registerUserDto);
    return this.userService.register(registerUserDto);
  }

  //login
  @Post('login')
  @IsPublic()
  login(@Body() loginUserDto: LoginUserDto) {
    this.logger.log('User login attempt', 'UserController');
    console.log(loginUserDto);
    return this.userService.login(loginUserDto);
  }

  //profile
  @UseGuards(LoginGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const userId = req['user'].userId;
    this.logger.log(`Getting profile for user with id: ${userId}`, 'UserController');
    return this.userService.getProfile(userId);
  }



  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file', {
    dest: 'uploads',
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only JPEG, PNG, and JPG files are allowed'), false);
      }
    }
  }))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    console.log(file.path);
    return 'This action uploads an avatar';
  }

  @Post('upload/large-file')
  @UseInterceptors(FileInterceptor('chunk', {
    dest: 'uploads',
    storage: storage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB
    }
  }))
  uploadLargeFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log('chunkName:', body.chunkName);
    console.log('file:', file);
    // Lấy fileName bằng cách split theo .part
    const chunkName = body.chunkName;
    const fileName = chunkName.split('.part')[0];
    const nameDir = `uploads/chunks-${fileName}`;
    // nếu thư mục chưa tồn tại thì tạo mới
    if (!fs.existsSync(nameDir)) {
      fs.mkdirSync(nameDir, { recursive: true });
    }
    // di chuyển file chunk vào thư mục tương ứng
    fs.renameSync(file.path, `${nameDir}/${body.chunkName}`);
    return 'This action uploads a large file';
  }

  // làm 1 hàm post gộp các chunk lại thành file hoàn chỉnh
  @Post('merge')
  async mergeChunks(@Body() body) {
    const { fileName, fileExtension } = body;
    const nameDir = `uploads/chunks-${fileName}`;

    if (!fs.existsSync(nameDir)) {
      throw new Error(`Chunks directory not found: ${nameDir}`);
    }

    if (!fs.existsSync('uploads/merged')) {
      fs.mkdirSync('uploads/merged', { recursive: true });
    }

    const chunkFiles = fs.readdirSync(nameDir);

    // Sort theo index
    chunkFiles.sort((a, b) => {
      const aIndex = parseInt(a.split('.part')[1]);
      const bIndex = parseInt(b.split('.part')[1]);
      return aIndex - bIndex;
    });

    const outputPath = `uploads/merged/${fileName}.${fileExtension}`;
    let startPos = 0;
    const promises: Promise<void>[] = [];

    // Pipe tất cả chunks SONG SONG với start position - NHANH NHẤT!
    chunkFiles.forEach(chunkFile => {
      // Đường dẫn đầy đủ đến chunk, dùng join để đảm bảo đúng đường dẫn trên mọi OS
      const chunkPath = path.join(nameDir, chunkFile);
      // hoặc dùng thủ công: const chunkPath = `${nameDir}/${chunkFile}`;
      // Lấy kích thước chunk để biết vị trí start cho chunk tiếp theo
      const chunkSize = fs.statSync(chunkPath).size;

      const promise = new Promise<void>((resolve, reject) => {
        const readStream = fs.createReadStream(chunkPath);
        const writeStream = fs.createWriteStream(outputPath, {
          start: startPos,
          // Chunk 0: flags: 'w',  start: 0    → Tạo file mới
          // Chunk 1: flags: 'r+', start: 1000 → Mở file cũ, ghi vào byte 1000
          // Chunk 2: flags: 'r+', start: 2000 → Mở file cũ, ghi vào byte 2000
          // Kết quả: File đầy đủ với 3 chunks!
          flags: startPos === 0 ? 'w' : 'r+' // w cho chunk đầu, r+ cho các chunk sau
        });

        readStream.pipe(writeStream);

        writeStream.on('finish', () => {
          fs.unlinkSync(chunkPath); // Xóa chunk sau khi ghi xong
          resolve();
        });

        writeStream.on('error', reject);
        readStream.on('error', reject);
      });

      promises.push(promise);
      startPos += chunkSize; // Cập nhật vị trí cho chunk tiếp theo
    });

    // Đợi tất cả chunks được ghi xong
    await Promise.all(promises);

    // Xóa thư mục chunks sau khi merge xong
    fs.rmdirSync(nameDir, { recursive: true });

    return {
      message: 'File merged successfully',
      path: outputPath
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
