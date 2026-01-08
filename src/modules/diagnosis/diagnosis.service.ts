import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import type { IUSer } from '@modules/users/users.service';
import { FilesService } from '@modules/files/files.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import FormData from 'form-data';
// import { TRANSLATIONS } from 'shared/translations';
import { Model } from 'mongoose';
import { Counter } from 'shared/counter.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Diagnosis } from './entities/diagnosis.entity';

export const TRANSLATIONS = {
  sucking_insects: 'Côn trùng trích hút',
  mosaic_virus: 'Khảm lá',
  powdery_mildew: 'Phấn trắng',
  downy_mildew: 'Sương mai',
  very_light: 'Rất nhẹ',
  light: 'Nhẹ',
  medium: 'Trung bình',
  heavy: 'Nặng',
  very_heavy: 'Rất nặng',
  cucumber: 'Dưa chuột',
  va838: 'Va838',
  early_flowering: 'Cây bắt đầu ra hoa',
  full_flowering: 'Ra hoa rộ',
  flowering_fruiting: 'Ra hoa – đậu quả',
  fruiting_young: 'Đậu quả (quả non)',
  leaf_cluster: 'Chùm lá',
  leaf: 'Lá',
  whole_plant_part: 'Toàn cảnh',
  front_view: 'Chính diện',
  wide_angle_view: 'Toàn cảnh',
  top_down_view: 'Vuông góc',
  healthy: 'Khỏe mạnh',
  none: 'Không có',
};

@Injectable()
export class DiagnosisService {
  constructor(
    private readonly filesService: FilesService,
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    @InjectModel(Diagnosis.name) private diagnosisModel: Model<Diagnosis>,
  ) {}

  async create(user: IUSer, image: Express.Multer.File) {
    if (!image)
      throw new BadRequestException('Vui lòng gửi ảnh để chuẩn đoán bệnh');

    const apiUrl = this.configService.get<string>('API_DIAGNOSIS_URL');
    if (!apiUrl)
      throw new BadRequestException('Chưa cấu hình API_DIAGNOSIS_URL');

    // Upload image to get buffer
    const formData = new FormData();
    formData.append('file', image.buffer, image.originalname);

    const apiResponse = await lastValueFrom(
      this.httpService.post(apiUrl, formData).pipe(
        map((r) => r.data),
        catchError((err) => {
          throw new BadRequestException(
            'Không thể kết nối đến dịch vụ chẩn đoán',
          );
        }),
      ),
    );

    // Translate classes
    const translateClass = (enClass: string): string => {
      const key = enClass?.toLowerCase().trim();
      return TRANSLATIONS[key] || enClass || 'Không xác định';
    };

    const detected = apiResponse.detected_diseases;
    const fullAnalysis = apiResponse.full_analysis;

    const translatedResult = {
      ...apiResponse,
      detected_diseases: detected.map((item: any) => ({
        class: translateClass(item.class),
        confidence: item.confidence,
      })),
      full_analysis: fullAnalysis.map((item: any) => ({
        class: translateClass(item.class),
        confidence: item.confidence,
      })),
    };

    const imageUrl = await this.filesService.uploadImage(image);

    const counter = await this.counterModel.findByIdAndUpdate(
      { _id: 'diagnosisId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const diagnosisData = {
      diagnosisId: counter.seq,
      userId: user.userId,
      image: imageUrl,
      detected_diseases: translatedResult.detected_diseases,
      status: apiResponse.status,
      full_analysis: translatedResult.full_analysis,
      details: apiResponse.details,
      meta: apiResponse.meta,
      createdAt: new Date(),
    };

    const savedDiagnosis = await this.diagnosisModel.create(diagnosisData);
  }

  findAll() {
    return `This action returns all diagnosis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diagnosis`;
  }

  update(id: number, updateDiagnosisDto: UpdateDiagnosisDto) {
    return `This action updates a #${id} diagnosis`;
  }

  remove(id: number) {
    return `This action removes a #${id} diagnosis`;
  }
}
