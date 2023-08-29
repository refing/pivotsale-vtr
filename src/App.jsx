import 'bootstrap/dist/css/bootstrap.min.css'
import transaksi from './data/transaksi.json';
// import axios from 'axios';
import { useState } from "react";
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

  
  const menus = ['Nasi Goreng', 'Mie Freno', 'Nasi Teriyaki', 'Nasi Ayam Katsu', 'Nasi Goreng Mawut','Teh Hijau','Teh Lemon','Teh','Kopi Hitam','Kopi Susu']
  const arrbulan = [
    "01", "02", "03", "04",
    "05", "06", "07", "08",
    "09", "10", "11", "12"
  ];
  const mapperBulan = {
    "01": 'Jan', "02": 'Feb', "03": 'Mar', "04": 'Apr',
    "05": 'Mei', "06": 'Jun', "07": 'Jul', "08": 'Ags',
    "09": 'Sep', "10": 'Okt', "11": 'Nov', "12": 'Des'
  };

  const pivot = {};
  Object.keys(mapperBulan).map(key => (
    pivot[key]={}
  ))
  console.log("pivot: ", pivot)
  filterTahun.forEach(penjualan=>{
    const {tanggal,menu,total}=penjualan;
    const bulan = tanggal.slice(5, 7)
    
    if(!pivot[bulan][menu]){
      pivot[bulan][menu]=0;
    }
    pivot[bulan][menu] += total;
  })
  console.log("pivot: ", pivot)

  const bulans = Object.keys(pivot);
  console.log(bulans)
  
  bulans.sort((a, b) => a.localeCompare(b));
  return (
    <div className="App">
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <head>
       
      </head>
      <body style={{maxWidth: '100%'}}>
        <div class="container-fluid">
        <div class="card" style={{margin:"2rem 0rem"}}>
            <div class="card-header">
                Venturo - Laporan penjualan tahunan per menu
            </div>
            <div class="card-body">
              <div class="row ">
              <div class="col-md-3">
                <select class="form-select form-select-sm m-1" value={selectTahun} onChange={handleSelectTahun}>
                  <option selected>Pilih Tahun</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              <div class="col-md-9">
                <button type="button" class="btn btn-primary m-1">Tampilkan</button>
                <button type="button" class="btn btn-secondary m-1">JSON Menu</button>
                <button type="button" class="btn btn-secondary m-1">JSON Transaksi</button>
                <button type="button" class="btn btn-secondary m-1">Download Example</button>
              </div>
              
              </div>
              
              <table class='table table-hover table-bordered'>
                <thead>
                    
                    <tr>
                      <th rowSpan="2" style={{fontSize: "11px", textAlign: "center", backgroundColor: "black",color: "white"}}>Menu</th>
                    
                      <th colSpan="12" style={{fontSize: "11px",textAlign: "center", backgroundColor: "black",color: "white"}}>Periode Pada {selectTahun}</th>
                  
                      <th rowSpan="2" style={{fontSize: "11px",textAlign: "center",backgroundColor: "black",color: "white"}}>Total</th>
                    </tr>
                    <tr >
                    {arrbulan.map(bulan => (
                      <th key={bulan} style={{ fontSize: "11px", textAlign: "center", backgroundColor: "black", color: "white" }}>
                        {mapperBulan[bulan]}
                      </th>
                    ))}
                    </tr>
                    
                </thead>


                <tbody>
                  <td colspan="14" style={{fontSize: "11px",backgroundColor: "#DCDCDC",fontWeight:"bold"}}>Makanan</td>
                  
                  
                  {menus.filter(menu=>mapperMenu["Makanan"].includes(menu))
                  .map(menu => (
                    <tr >
                      <td style={{fontSize: "11px",textAlign: "left"}}>{menu}</td>
                      {bulans.map(bulan => (
                        <td style={{fontSize: "11px",textAlign: "right"}} key={bulan}>{pivot[bulan][menu] || null}</td>
                      ))}
                      <td style={{fontSize: "11px",textAlign: "right",fontWeight:"bold"}}>
                        {bulans.reduce(
                          (subtotal, bulan) => subtotal + (pivot[bulan][menu] || 0),
                          0
                        )}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td style={{fontSize: "11px",backgroundColor: "black",color: "white",fontWeight:"bold"}}>Subtotal Makanan</td>
                    
                    {bulans.map(bulan => (
                      <td key={bulan} style={{fontSize: "11px",textAlign: "right", backgroundColor: "black",color: "white",fontWeight:"bold"}}>
                      {menus.filter(menu=>mapperMenu["Makanan"].includes(menu)).reduce(
                        (subtotal, menu) => subtotal + (pivot[bulan][menu] || 0),
                        0
                      )||null}
                    </td>
                    ))}
                    
                    {/* grand total */}
                    <td style={{fontSize: "11px",textAlign: "right", backgroundColor: "black",color: "white",fontWeight:"bold"}}>
                      {menus.filter(menu=>mapperMenu["Makanan"].includes(menu)).reduce(
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
                  <td colspan="14" style={{fontSize: "11px",backgroundColor: "#DCDCDC",fontWeight:"bold"}}>Minuman</td>
                  {menus.filter(menu=>mapperMenu["Minuman"].includes(menu))
                  .map(menu => (
                    
                    <tr key={menu}>
                      <td style={{fontSize: "11px",textAlign: "left"}}>{menu}</td>
                      {bulans.map(bulan => (
                        <td style={{fontSize: "11px",textAlign: "right"}} key={bulan}>{pivot[bulan][menu] ||null}</td>
                      ))}
                      <td style={{fontSize: "11px",textAlign: "right",fontWeight:"bold"}}>
                        {bulans.reduce(
                          (subtotal, bulan) => subtotal + (pivot[bulan][menu] || 0),
                          0
                        )}
                      </td>
                      
                    </tr>
                  ))}
                  <tr>
                    <td style={{fontSize: "11px",backgroundColor: "black",color: "white",fontWeight:"bold"}}>Subtotal Minuman</td>
                    
                    {bulans.map(bulan => (
                      <td class="text" key={bulan} style={{fontSize: "11px",textAlign: "right", backgroundColor: "black",color: "white",fontWeight:"bold"}}>
                      {menus.filter(menu=>mapperMenu["Minuman"].includes(menu)).reduce(
                        (subtotal, menu) => subtotal + (pivot[bulan][menu] || 0),
                        0
                      )||null}
                    </td>
                    ))}
                    <td style={{fontSize: "11px",textAlign: "right", backgroundColor: "black",color: "white",fontWeight:"bold"}}>
                      {menus.filter(menu=>mapperMenu["Minuman"].includes(menu)).reduce(
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
                  

                  <tr>
                    <td style={{fontSize: "11px",backgroundColor: "black",color: "white",fontWeight:"bold"}}>Total</td>
                    {bulans.map(bulan => (
                      <td key={bulan} style={{fontSize: "11px",textAlign: "right", backgroundColor: "black",color: "white",fontWeight:"bold"}}>
                        {menus.reduce(
                          (subtotal, menu) => subtotal + (pivot[bulan][menu] || 0),
                          0
                        )||null}
                      </td>
                    ))}
                    <td style={{fontSize: "11px",textAlign: "right", backgroundColor: "black",color: "white",fontWeight:"bold"}}>
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
        </div>
          
        
        </div>
      </body>
    </div>
  );
}

export default App;
