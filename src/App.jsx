import 'bootstrap/dist/css/bootstrap.min.css'
import transaksi from './data/transaksi.json';
// import axios from 'axios';
import { useState, useEffect } from "react";
function App() {
  
  // const [data, setData] = useState("")
  // rencana awal retrieve data dari API, Error CORS Cross origin 
  // useEffect(() => {
  //   axios.get("https://tes-web.landa.id/intermediate/transaksi").then((response) => {
  //     setData(response);
  //   });
  // }, []);


  const [selectTahun, setTahun] = useState("")
  
  const handleSelectTahun = event => {
    setTahun(event.target.value);
  };

  const filterTahun = selectTahun
    ? transaksi.filter(datajual => datajual.tanggal.slice(0,4) === selectTahun)
    : transaksi;



  const mapperMenu = {"Makanan":['Nasi Goreng', 'Mie Freno', 'Nasi Teriyaki', 'Nasi Ayam Katsu', 'Nasi Goreng Mawut'],
                  "Minuman":['Teh Hijau','Teh Lemon','Teh','Kopi Hitam','Kopi Susu']}
 
  const pivot = {};
  filterTahun.forEach(penjualan=>{
    const {tanggal,menu,total}=penjualan;
    const bulan = tanggal.slice(5,7);
    if(!pivot[bulan]){
      pivot[bulan]={};
    }
    if(!pivot[bulan][menu]){
      pivot[bulan][menu]=0;
    }
    pivot[bulan][menu] += total;
  })

  const bulans = Object.keys(pivot);
  const mapperBulan = {
    "01": 'Jan', "02": 'Feb', "03": 'Mar', "04": 'Apr',
    "05": 'Mei', "06": 'Jun', "07": 'Jul', "08": 'Ags',
    "09": 'Sep', "10": 'Okt', "11": 'Nov', "12": 'Des'
  };
  bulans.sort((a, b) => a.localeCompare(b));

  const menus = Array.from(new Set(filterTahun.map(penjualan => penjualan.menu)))
  
  return (
    <div className="App">
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <body style={{maxWidth: '100%'}}>
        <div class="container-fluid">
          <h4>Venturo - Laporan penjualan tahunan per menu</h4>
          <div class="container ">
            <select class="form-select form-select-sm m-1" value={selectTahun} onChange={handleSelectTahun}>
              <option selected>Pilih Tahun</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
            </select>
            <button type="button" class="btn btn-primary m-1">Tampilkan</button>
            <button type="button" class="btn btn-secondary m-1">JSON Menu</button>
            <button type="button" class="btn btn-secondary m-1">JSON Transaksi</button>
            <button type="button" class="btn btn-secondary m-1">Download Example</button>
          </div>
          
          <table class='table '>
            <thead class="thead-dark">
              <tr >
                <th style={{textAlign: "center", backgroundColor: "black",color: "white"}}>Menu</th>
                {bulans.map(bulan => (
                  <th key={bulan} style={{textAlign: "center",backgroundColor: "black",color: "white"}}>{mapperBulan[bulan]}</th>
                  ))}
                  <th style={{textAlign: "center",backgroundColor: "black",color: "white"}}>Total</th>
              </tr>
            </thead>


            <tbody>
              <td colspan="14" style={{backgroundColor: "#DCDCDC"}}>Makanan</td>
              {menus.filter(menu=>mapperMenu["Makanan"].includes(menu))
              .map(menu => (
                
                <tr key={menu}>
                  <td>{menu}</td>
                  {bulans.map(bulan => (
                    <td style={{textAlign: "right"}} key={bulan}>{pivot[bulan][menu] || 0}</td>
                  ))}
                  <td style={{textAlign: "right"}}>
                    {bulans.reduce(
                      (subtotal, bulan) => subtotal + (pivot[bulan][menu] || 0),
                      0
                    )}
                  </td>
                </tr>
              ))}
              <td colspan="14" style={{backgroundColor: "#DCDCDC"}}>Minuman</td>
              {menus.filter(menu=>mapperMenu["Minuman"].includes(menu))
              .map(menu => (
                
                <tr key={menu}>
                  <td>{menu}</td>
                  {bulans.map(bulan => (
                    <td style={{textAlign: "right"}} key={bulan}>{pivot[bulan][menu] || 0}</td>
                  ))}
                  <td style={{textAlign: "right"}}>
                    {bulans.reduce(
                      (subtotal, bulan) => subtotal + (pivot[bulan][menu] || 0),
                      0
                    )}
                  </td>
                </tr>
              ))}

              <tr>
                <td style={{backgroundColor: "black",color: "white"}}>Total</td>
                {bulans.map(bulan => (
                  <td key={bulan} style={{textAlign: "right", backgroundColor: "black",color: "white"}}>
                    {menus.reduce(
                      (subtotal, menu) => subtotal + (pivot[bulan][menu] || 0),
                      0
                    )}
                  </td>
                ))}
                <td style={{textAlign: "right", backgroundColor: "black",color: "white"}}>
                  {menus.reduce(
                    (grandTotal, menu) =>
                      grandTotal +
                      bulans.reduce(
                        (subtotal, bulan) => subtotal + (pivot[bulan][menu] || 0),
                        0
                      ),
                    0
                  )}
                </td>
              </tr>
            </tbody>
            
          </table>
        
        </div>
      </body>
    </div>
  );
}

export default App;
