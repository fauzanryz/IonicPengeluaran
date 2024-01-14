import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  CapacitorSQLite,
  capConnectionOptions,
} from '@capacitor-community/sqlite';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class SQLiteService {
  //private db: any;
  db = CapacitorSQLite;
  // jika menggunakan physical device, silahkan menggunakan tethering
  // lalu cek ip address dari laptop/pc yang digunakan
  // untuk windows, gunakan perintah ipconfig
  // untuk linux, gunakan perintah ifconfig
  //private apiUrl = '/todo';
  // jika menggunakan emulator, silahkan menggunakan localhost
  // private apiUrl = 'http://172.22.2.57/todo/api.php';
  private apiUrl = 'http://192.168.43.24/IonicPengeluaran/api.php';
  constructor(private http: HttpClient) {
    this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    const dbOptions: capConnectionOptions = {
      database: 'my-database',
      encrypted: false,
      mode: 'no-encryption',
      readonly: false,
    };

    // Use this.db as a reference to CapacitorSQLite for executing queries
    this.db = CapacitorSQLite;
    this.db.createConnection(dbOptions);
    this.db.open({ database: 'my-database', readonly: false });

    await this.createTable();
  }

  private async createTable(): Promise<void> {
    const query = `
    CREATE TABLE IF NOT EXISTS pengeluaran (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tanggal TEXT NOT NULL,
      nominal TEXT NOT NULL,
      tujuan TEXT  NOT NULL,
      keterangan TEXT NOT NULL
    )`;

    // Use CapacitorSQLite for running queries
    await this.db.run({
      database: 'my-database',
      statement: query,
      values: [],
    });
  }

  async insertPengeluaran(
    tanggal: string,
    nominal: string,
    tujuan: string,
    keterangan: string
  ): Promise<void> {
    const query = `INSERT INTO pengeluaran (tanggal, nominal, tujuan, keterangan) VALUES (?, ?, ?, ?)`;

    await this.db.run({
      database: 'my-database',
      statement: query,
      values: [tanggal, nominal, tujuan, keterangan],
    });
  }

  async getPengeluaran(): Promise<any[]> {
    const query = 'SELECT * FROM pengeluaran';
    const result = await this.db.query({
      database: 'my-database',
      statement: query,
      values: [],
    });
    return result?.values || [];
  }

  async updatePengeluaran(
    id: number,
    tanggal: string,
    nominal: string,
    tujuan: string,
    keterangan: string
  ): Promise<void> {
    const query =
      'UPDATE pengeluaran SET tanggal = ?, nominal = ?, tujuan = ?, keterangan = ? WHERE id = ?';
    await this.db.run({
      database: 'my-database',
      statement: query,
      values: [tanggal, nominal, tujuan, keterangan, id],
    });
  }

  async deletePengeluaran(id: number): Promise<void> {
    const query = 'DELETE FROM pengeluaran WHERE id = ?';
    await this.db.run({
      database: 'my-database',
      statement: query,
      values: [id],
    });
  }

  // Sinkronisasi ke API dan SQLite
  // Sync all local pegeluaran to the remote API

  // insert pegeluaran ke remote API
  // fungsinya menyinkronkan penambahan data pegeluaran ke server
  // setelah data pegeluaran ditambahkan ke local storage
  // method ini dipakai di home.page.ts

  async insertPengeluaranAndSync(
    tanggal: string,
    nominal: string,
    tujuan: string,
    keterangan: string
  ) {
    await this.insertPengeluaran(tanggal, nominal, tujuan, keterangan); // Add to local SQLite database
    await this.syncPengeluaranNative(tanggal, nominal, tujuan, keterangan); // Sync with the remote API
  }

  async updatePengeluaranAndSync(
    id: number,
    tanggal: string,
    nominal: string,
    tujuan: string,
    keterangan: string
  ) {
    await this.updatePengeluaran(id, tanggal, nominal, tujuan, keterangan); // Add to local SQLite database
    await this.updatePengeluaranNative(
      id,
      tanggal,
      nominal,
      tujuan,
      keterangan
    ); // Sync with the remote API
  }

  async deletePengeluaranAndSync(id: number) {
    await this.deletePengeluaran(id); // Add to local SQLite database
    await this.deletePengeluaranNative(id); // Sync with the remote API
  }

  //

  //sync pengeluaran ke server
  private async syncPengeluaranNative(
    tanggal: string,
    nominal: string,
    tujuan: string,
    keterangan: string
  ): Promise<void> {
    const options = {
      url: this.apiUrl,
      headers: { 'Content-Type': 'application/json' },
    };

    let payload = {
      type: 'insertPengeluaran',
      tanggal: tanggal,
      nominal: nominal,
      tujuan: tujuan,
      keterangan: keterangan,
    };
    const sendValue = {
      ...options,
      data: payload,
    };
    console.log('Syncing Pengeluaran value:', JSON.stringify(payload));
    const response = await CapacitorHttp.request({
      ...sendValue,
      method: 'POST',
    });

    console.log('Pengeluaran synced successfully');
    console.log('response', JSON.stringify(response));
  }

  //
  // update pengeluaran ke server
  private async updatePengeluaranNative(
    id: number,
    tanggal: string,
    nominal: string,
    tujuan: string,
    keterangan: string
  ): Promise<void> {
    const options = {
      url: this.apiUrl,
      headers: { 'Content-Type': 'application/json' },
    };

    let payload = {
      type: 'updatePengeluaran',
      id: id,
      tanggal: tanggal,
      nominal: nominal,
      tujuan: tujuan,
      keterangan: keterangan,
    };
    const sendValue = {
      ...options,
      data: payload,
    };
    console.log('Syncing Pengeluaran value:', JSON.stringify(payload));
    const response = await CapacitorHttp.request({
      ...sendValue,
      method: 'PUT',
    });

    console.log('Pengeluaran synced successfully');
    console.log('response', JSON.stringify(response));
  }

  // delete pengeluaran ke server
  private async deletePengeluaranNative(id: number): Promise<void> {
    const options = {
      url: this.apiUrl,
      headers: { 'Content-Type': 'application/json' },
    };

    let payload = {
      type: 'deletePengeluaran',
      id: id,
    };
    const sendValue = {
      ...options,
      data: payload,
    };
    console.log('Syncing Pengeluaran value:', JSON.stringify(payload));
    const response = await CapacitorHttp.request({
      ...sendValue,
      method: 'DELETE',
    });

    console.log('Pengeluaran synced successfully');
    console.log('response', JSON.stringify(response));
  }

  //
}
