import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { SQLiteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pengeluaran: any[] = [];
  constructor(private sqliteService: SQLiteService) {
    this.loadPengeluaran();
  }

  async loadPengeluaran() {
    this.pengeluaran = await this.sqliteService.getPengeluaran();
    console.log(this.pengeluaran);
  }

  @ViewChild(IonModal)
  modal!: IonModal;
  tanggal: string = '';
  nominal: string = '';
  tujuan: string = '';
  keterangan: string = '';
  selectedIDPengeluaran: any = '';

  cancelInsert() {
    this.modal.dismiss(null, 'cancel');
  }

  confirmInsert() {
    this.modal.dismiss(this.tanggal, 'confirm');
    const insertPengeluaran = {
      tanggal: this.tanggal,
      nominal: this.nominal,
      tujuan: this.tujuan,
      keterangan: this.keterangan,
    };

    if (insertPengeluaran) {
      console.log(
        'Menambahkan Pengeluaran: ',
        this.tanggal,
        ' nominal: ',
        this.nominal,
        ' tujuan: ',
        this.tujuan,
        ' keterangan: ',
        this.keterangan
      );
      this.savePengeluaranAndSync(
        insertPengeluaran.tanggal,
        insertPengeluaran.nominal,
        insertPengeluaran.tujuan,
        insertPengeluaran.keterangan
      );
    }
  }

  savePengeluaranAndSync(
    tanggal: string,
    nominal: string,
    tujuan: string,
    keterangan: string
  ): void {
    this.sqliteService
      .insertPengeluaranAndSync(tanggal, nominal, tujuan, keterangan)
      .then(() => {
        console.log('Pengeluaran added and synced successfully');
        this.loadPengeluaran(); // Memperbarui daftar Pengeluaran setelah menambahkan Pengeluaran baru
      })
      .catch((error) =>
        console.error('Error adding and syncing Pengeluaran', error)
      );
  }

  //

  // update buku starts here
  cancelUpdate() {
    this.modal.dismiss(this.selectedIDPengeluaran, 'cancel');
  }

  selectPengeluaran(pengeluaran: any) {
    this.selectedIDPengeluaran = pengeluaran.id;
  }

  //
  confirmUpdate() {
    const updatePengeluaran = {
      id: this.selectedIDPengeluaran,
      tanggal: this.tanggal,
      nominal: this.nominal,
      tujuan: this.tujuan,
      keterangan: this.keterangan,
    };

    if (updatePengeluaran) {
      console.log(
        'id: ',
        updatePengeluaran.id,
        'tanggal: ',
        this.tanggal,
        ' nominal: ',
        this.nominal,
        ' tujuan: ',
        this.tujuan,
        ' keterangan: ',
        this.keterangan
      );
      this.updatePengeluaranAndSync(
        updatePengeluaran.id,
        updatePengeluaran.tanggal,
        updatePengeluaran.nominal,
        updatePengeluaran.tujuan,
        updatePengeluaran.keterangan
      );
    }
    this.modal.dismiss(this.selectedIDPengeluaran, 'confirm');
  }

  updatePengeluaranAndSync(
    id: number,
    tanggal: string,
    nominal: string,
    tujuan: string,
    keterangan: string
  ): void {
    this.sqliteService
      .updatePengeluaranAndSync(id, tanggal, nominal, tujuan, keterangan)
      .then(() => {
        console.log('Pengeluaran updated and synced successfully');
        this.loadPengeluaran(); // Memperbarui daftar Pengeluaran setelah menambahkan Pengeluaran baru
      })
      .catch((error) =>
        console.error('Error updated and syncing Pengeluaran', error)
      );
  }

  //
  // delete buku starts here

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      },
    },
    {
      text: 'Confirm',
      role: 'confirm',
      handler: () => {
        const deletePengeluaran = {
          id: this.selectedIDPengeluaran,
        };

        if (deletePengeluaran) {
          console.log('id: ', deletePengeluaran.id);
          this.deletePengeluaranAndSync(deletePengeluaran.id);
        }
      },
    },
  ];

  deletePengeluaranAndSync(id: number): void {
    this.sqliteService
      .deletePengeluaranAndSync(id)
      .then(() => {
        console.log('Pengeluaran deleted and synced successfully');
        this.loadPengeluaran(); // Memperbarui daftar Pengeluaran setelah menambahkan Pengeluaran baru
      })
      .catch((error) =>
        console.error('Error deleted and syncing Pengeluaran', error)
      );
  }

  //
}
