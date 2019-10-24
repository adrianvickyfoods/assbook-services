import { Module } from '@nestjs/common';
import { ImageService } from './image/image.service';

@Module({
  providers: [
    ImageService,
    {
      provide: 'MAPBOX_TOKEN',
      useValue: 'pk.eyJ1IjoiYXJ0dXJvYmVyIiwiYSI6ImNrMXFlc29vazExaDUzbms2cWdpb3l6cGwifQ.hyoOv4iVc6XqWPYBKa4NkQ',
    },
  ],
  exports: [ImageService, 'MAPBOX_TOKEN'],
})
export class CommonsModule {}
