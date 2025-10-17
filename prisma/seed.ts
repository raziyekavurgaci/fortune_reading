import { PrismaClient } from '@prisma/client';
import { tarotCards } from './data/card';

class TarotSeeder {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
    console.log('TarotSeeder başlatıldı ve veritabanına bağlanmaya hazır.');
  }
  /**
   * Ana çalıştırma metodu.
   * Silme ve ekleme işlemlerini güvenli bir 'transaction' içinde yapar.
   */
  public async run() {
    console.log('Seed işlemi çalıştırılıyor...');
    try {
      await this.seedTarotCards();
      console.log('Seed işlemi başarıyla tamamlandı.');
    } catch (error) {
      console.error('Seed işlemi sırasında bir hata oluştu:', error);
      process.exit(1); // Hata durumunda script'i hata koduyla sonlandır
    } finally {
      // Her durumda veritabanı bağlantısını güvenli bir şekilde sonlandır
      console.log('Veritabanı bağlantısı kapatılıyor.');
      await this.prisma.$disconnect();
    }
  }

  private async seedTarotCards() {
    // Eğer createMany sırasında bir hata olursa, deleteMany işlemi geri alınır.
    await this.prisma.$transaction(async (tx) => {
      // 1. Mevcut tüm kartları sil
      await tx.tarotCard.deleteMany({});
      console.log('- Mevcut tarot kartları silindi.');
      const result = await tx.tarotCard.createMany({
        data: tarotCards,
      });
      console.log(`- ${result.count} yeni tarot kartı eklendi.`);
    });
  }
}
const seeder = new TarotSeeder();
seeder.run();
