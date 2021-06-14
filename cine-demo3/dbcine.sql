SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE NGUOI_DUNG_ADMIN(
    `IDnguoidung` INT PRIMARY KEY NOT NULL,
    `Email` VARCHAR(50),
    `Matkhau` VARCHAR(20),
    `Hoten` VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Sodienthoai` VARCHAR(11),
    `Vaitro` INT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO `NGUOI_DUNG_ADMIN` (`IDnguoidung`, `Email`, `Matkhau`, `Hoten`, `Sodienthoai`, `Vaitro`) VALUES
(1, 'admin@gmail.com', 'admin', 'admin', '123456789', '0'),
(2, 'user1@gmail.com', 'user1', 'user1', '123456789', '1');



 CREATE TABLE CUM_RAP(
    `IDcumrap` VARCHAR(50) PRIMARY KEY NOT NULL,
    `Tencumrap` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Diachi` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 

INSERT INTO `CUM_RAP` (`IDcumrap`, `Tencumrap`, `Diachi`) VALUES
('CR1', N'Quốc Thanh', N'01 Quốc Thanh'),
('CR2', 'Hai Bà Trưng', N'02 Hai Bà Trưng'),
('CR3', 'Bình Dương', N'03 Bình Dương');

CREATE TABLE RAP(
    IDrap VARCHAR(50) PRIMARY KEY NOT NULL,
    Tenrap VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    IDcumrap VARCHAR(50),
    Loairap VARCHAR(50) ,
    Kichthuocngang INT,
    Kichthuocdoc INT,
    CONSTRAINT fk_RAP_CUM_RAP FOREIGN KEY(IDcumrap) REFERENCES CUM_RAP(IDcumrap)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 

INSERT INTO `RAP` (`IDrap`, `Tenrap`, `IDcumrap`, `Loairap`, `Kichthuocngang`, `Kichthuocdoc`) VALUES
('R1', N'Cine Quốc Thanh', 'CR1', '2D', 15, 30),
('R2', N'Cine Bình Dương', 'CR3', '3D', 18, 33),
('R3', N'Cine Hai Bà Trưng', 'CR2', '4DX', 20, 35);


CREATE TABLE PHIM(
    IDphim VARCHAR(50) PRIMARY KEY NOT NULL,
    Tenphim VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    Ngaycongchieu DATE,
    Posterphim VARCHAR(100),
    Thoiluong INT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 

INSERT INTO `PHIM` (`IDphim`, `Tenphim`, `Ngaycongchieu`, `Posterphim`, `Thoiluong`) VALUES
('P1', N'', '2021-12-16', '', 125),
('P2', N'', '2021-12-16', '', 180),
('P3', N'', '2021-12-16', '', 95);

CREATE TABLE SUAT_CHIEU(
    IDsuatchieu VARCHAR(50) PRIMARY KEY NOT NULL,
    IDphim VARCHAR(50),
    IDrap VARCHAR(50),
    Batdau DATETIME,
    Ketthuc DATETIME,
    Giave FLOAT,
    CONSTRAINT fk_SUAT_CHIEU_PHIM FOREIGN KEY(IDphim) REFERENCES PHIM(IDphim),
    CONSTRAINT fk_SUAT_CHIEU_RAP FOREIGN KEY(IDrap) REFERENCES RAP(IDrap)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 
INSERT INTO `SUAT_CHIEU` (`IDsuatchieu`, `IDphim`, `IDrap`, `Batdau`, `Ketthuc`, `Giave`) VALUES
('SC1', 'P1', 'R3', '2021-12-16 12:51:36', '2021-12-16 14:51:36', 55000),
('SC2', 'P1', 'R3', '2021-12-16 12:51:36', '2021-12-16 14:51:36', 55000),
('SC3', 'P3', 'R1', '2021-12-16 12:51:36', '2021-12-16 14:51:36', 90000);

CREATE TABLE DAT_CHO(
    IDdatcho VARCHAR(50) PRIMARY KEY NOT NULL,
    IDnguoidung INT,
    IDsuatchieu VARCHAR(50),
    Thoigiandatve DATETIME,
    Tongtien FLOAT,
    CONSTRAINT fk_DAT_CHO_SUAT_CHIEU FOREIGN KEY(IDsuatchieu) REFERENCES SUAT_CHIEU(IDsuatchieu),
    CONSTRAINT fk_DAT_CHO_NGUOI_DUNG_ADMIN FOREIGN KEY(IDnguoidung) REFERENCES NGUOI_DUNG_ADMIN(IDnguoidung)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 

CREATE TABLE VE(
    IDve VARCHAR(50) PRIMARY KEY NOT NULL,
    IDdatcho VARCHAR(50),
    IDrap VARCHAR(50),
    Maghe VARCHAR(50),
    Giatien FLOAT,
    CONSTRAINT fk_VE_RAP FOREIGN KEY(IDrap) REFERENCES RAP(IDrap)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


<!-- <section py-5>
    <br>
    <div class="row align-items-center container my-5 mx-auto">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">
                    Cum Rap
              </label>
            </div>
            
            <select  onchange="insertValue();" class="custom-select" id="inputGroupSelect01" name="CRap">
                <% if (check === undefined){%>
                    <option selected>Xin chon Cum Rap</option>
                <%}else{%>
                    <option selected><%- check %></option>
                <%}%>
                
                <% for (const key in result_CR)
                {%>
                    
                    <option  onclick="this.value=''" id="cumrap" name="cumrap"  ><%- result_CR[key].Tencumrap %></option>
                    
                <%}%>
            </select>

        </div>
                  
        <div class="input-group mb-3">
            <div class="input-group-append">
                <label class="input-group-text" for="inputGroupSelect02">Rap</label>
            </div>
            <form   method="GET">
                    
                   
                    <input hidden readonly type="text" name="cumrap_temp" id="cumrap_temp" >
                    <button id="sb" hidden type="submit">submit</button>
            </form>
            <form   method="GET">
                   
                   
                    <input hidden readonly type="text" name="rap_temp" id="rap_temp" >
                    <button id="sb1" hidden type="submit">submit</button>
            </form>
        

            <select onclick="insertValue1();" class="custom-select " id="inputGroupSelect02" name="Rap">
                
                <% for (const key in result_CR_R)
                {
                    if (result_CR_R[key].Tencumrap === check.cumrap) {%>   
                    <option id="rap" name="rap"><%- result_CR_R[key].Tenrap %></option>
                        <%}    
                }%>

            </select>  

        </div>


        <div class="input-group mb-3">
            <div class="input-group-append">
                <label class="input-group-text" for="inputGroupSelect03"></label>
            </div>
                
                
                <table class="table table-dark">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">IDsuatchieu</th>
                        <th scope="col">IDphim</th>
                        <th scope="col">Giave</th>
                      </tr>
                    </thead>
                    <tbody>
                            <tr>
                        <% for (const key in found3)
                        {%>
                            
                            <td ><%- found3[key].IDsuatchieu %></td>
                            <td ><%- found3[key].IDphim %></td>
                            <td ><%- found3[key].Giave %></td>
                        <%}%>
 
                
                      </tr>
                      
                    </tbody>
                  </table>




        </div>
                  
    </div>



    
</section> -->

<!-- <script>

    function insertValue(){
        var txt = document.getElementsByName('CRap')[0].value;
        document.getElementById('cumrap_temp').value = txt;

       
        var button = document.getElementById('sb');
        button.form.submit();


    }
    function insertValue1(){
        var txt = document.getElementsByName('Rap')[0].value;
        document.getElementById('rap_temp').value = txt;

       
        var button = document.getElementById('sb1');
        button.form.submit();


    }




    function getget(){
        var selectValue = document.getElementById('inputGroupSelect01').value;
        document.getElementById('cumrap_temp').value = selectValue;

        return selectValue;


    }

    function getAndSetVal(){
        var txt1 = document.getElementsByName('CRap')[0].value;
        document.getElementById('cumrap_temp').value = txt1;
    }

    function getVal(){
        var txt2 = document.getElementById('cumrap_temp').value;
        return txt2;
    }
</script>
 -->
 <!-- <% if(checked)
                                                                {%>
                                                                    <script>          
                                                                        var temp = document.getElementById('lb_cumrap').value;                                                              
                                                                        document.getElementById('cumrap').value = temp;
                                                                    </script>
                                                                    <%}else{%>
                                                                        <script>          
                                                                                                                                         
                                                                            document.getElementById('cumrap').value = '';
                                                                        </script>
                                                                    <%}%>
                                                        
                                                                > -->

                                                                 <!-- <div  class="input-group mb-3">
                                                        <div class="input-group-prepend">
                                                          <div class="input-group-text">
                                                            <input id="agree" type="checkbox" aria-label="Checkbox for following text input">
                                                          </div>
                                                        </div>
                                                        <input id="tencumrap"  readonly type="text" class="form-control" aria-label="" value=" <%-  found_CumRap[key].Tencumrap %>">
                                                        <input id="diachi" readonly type="text" class="form-control" aria-label="" value="<%- found_CumRap[key].Diachi %>">
                                                        <input id="idcumrap" hidden readonly type="text" class="form-control" aria-label="" value="<%- found_CumRap[key].IDcumrap %>">
                                                </div> -->

                                                document.getElementById('agree').onclick = function() {
    // access properties using this keyword
    if ( this.checked ) {
        // Returns true if checked
        alert( this.value );
    } else {
        // Returns false if not checked
    }
};




















<div class="form-group">
                                                        <div class="form-check" >
                                                                <input onchange="getcumrap();"  class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" >
                                                 
                                                                <label id="lb_cumrap" class="form-check-label" for="gridRadios1">
                                                                        <%-  found_CumRap[key].Tencumrap %>
                                                                </label>
                                                                <script>
                                                                        function getcumrap(){
                                                                            if (document.getElementById('gridRadios1').checked == true){
                                                                                var temp = document.getElementById("lb_cumrap").innerHTML;                                                              
                                                                            document.getElementById('cumrap').innerHTML = temp;
                                                                            }
                                                                            
                                                                        };
                                                                    </script>
                                                            </div>
                                                </div>





                                                <div class="card mb-3" style="min-width: 15rem; max-width: 15rem; border: none;">
                                                <form  method="POST" >
                                                    <!-- <input hidden type="text" name="id_phim" id="id_phim"  value="<%- list_phimdangchieu[key].IDphim%>"> -->
                                                    <label for="" id="id_phim" name="id_phim"><%- list_phimdangchieu[key].IDphim%></label>
                                                    <!-- <input type="submit" name="title_tenphim" id="title_tenphim"  value="<%- list_phimdangchieu[key].Tenphim%>">
                                                    <input  type="image" class="card-img-top" style="max-height: 20rem;" src="<%- list_phimdangchieu[key].Posterphim %>"  alt="Card image cap" /> -->
                                                    
                                                    <button type="submit">
                                                        <img type="image"  class="card-img-top" style="max-height: 20rem;"  src="<%- list_phimdangchieu[key].Posterphim %>" alt="Card image cap">
                                                    </button>
                                                

                                                    
                                                    
                                                    <div class="card-body">
                                                    <h5  class="text-center card-title"><%- list_phimdangchieu[key].Tenphim%></h5>
                                                    
                                                    </div>
                                                    <div class="card-footer">
                                                    <small class="text-muted">Time:  <%- list_phimdangchieu[key].Thoiluong %></small>
                                                    <small class="text-muted">Date:  <%- list_phimdangchieu[key].Ngaycongchieu %></small>
                                                    </div>
                                                </form>

                                            </div>









// var key;
                        // var array_test = [];
                        // console.log(temp_test.length);
                        // for ( key  = 0; key <= temp_test.length ; key++){
                          
                        //   var check = document.getElementById('test')[key].innerText;
                         
                        //   if(check == txt)
                        //   {
                        //     console.log(key);
                        //     array_test.push(key);
                        //   }
                          
                        // }
                        // var x = document.getElementById("inputGroupSelect04");
                        //           var option = document.createElement("option");
                        //           option.text = found_CumRap_Rap[key].Tenrap;
                        //           x.add(option);
                        <% for (const key in found_CumRap_Rap){

                            console.log(found_CumRap_Rap[key].Tencumrap);
                                if(found_CumRap_Rap[key].Tencumrap === "Hai Bà Trưng"){
                                  
                                  console.log(found_CumRap_Rap[key].Tencumrap);
                                }


                        }%>
                        
                          

                  

                    }



/////////////////////////////////////////////////

                        <% 

                            for (i = 0 ; i < 4; i++ ){
                                for(const key in found_v_dc){%>
                                    <div class="my-1 row align-items-center text-center container">
                                   <% for (j = 0; j < 5; j++){       %>                                   
                                        <div class="card mr-2">
                                        
                                               <% if(array[i][j] === found_v_dc[key].Maghe){%>
                                                    <div style="background-color: olivedrab;"  class="card-body">
                                                            <p><%- array[i][j]%></p>
                                                    </div>
                                                    
                                               <% }else{ %>
                                                    <div class="card-body">
                                                            <p><%- array[i][j]%></p>
                                                    </div>
                                               <% }%>
                                            

                                        
                                        </div>
                                   <% }%>
                                    </div>
                                <%}
                            }%>                    



<script >
    const container = document.querySelector('.container');
    const seats = document.querySelectorAll('.row .seat:not(.occupied)');
    const count = document.getElementById('count');
    const total = document.getElementById('total');
    const movieSelect = document.getElementById('movie');
    const list_temp = document.getElementById('listlist');

    populateUI();

    let ticketPrice = +movieSelect.value;

    //save selected movie index and price
    function setMovieData(movieIndex, moviePrice){
        localStorage.setItem('selectedMovieIndex', movieIndex);
        localStorage.setIvaluetem('selectedMoviePrice', moviePrice);
    }

    //update total and count
    function updateSelectedCount() {
        const selectedSeats = document.querySelectorAll('.row .seat.selected');

        const seatsIndex = [...selectedSeats].map(seat => [...seats].value);

        localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
        
        const selectedSeatsCount = selectedSeats.length;
        
        
        count.innerText = selectedSeatsCount;
        total.innerText = selectedSeatsCount * ticketPrice;
    }

    //get data from local storage & populate UI
    function populateUI() {
        const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
        if (selectedSeats !== null && selectedSeats.length > 0) {
            seats.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add('selected');
            }
            });
        }

        const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

        if (selectedMovieIndex !== null) {
            movieSelect.selectedIndex = selectedMovieIndex;
        }
    }

    //movie select event
    movieSelect.addEventListener('change', e => {
        ticketPrice = +e.target.value;
        setMovieData(e.target.selectedIndex, e.target.value)
        updateSelectedCount();
    });
    
    //seat click event
    container.addEventListener('click', e => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied'))
    {
        e.target.classList.toggle('selected');

        
        updateSelectedCount();
    }
    });

    //initial count and total set
    updateSelectedCount();

</script>



<div class="">
<% 
for (i = 0 ; i < 5; i++ ){  %>
<div class="row p-2 ">

<% for(const key in found_v_dc){          
      for (k = 0 ; k < 8; k++){   
        if(array[i][k] === found_v_dc[key].Maghe){%>                                                                                                                     
          <div class="seat occupied"></div>    
        <% }else{ %>
          <div   id="seat" class="seat text-center" ><%- array[i][k]%></div>    
        <% }

      }
}%>
</div>

<% }
%>      
</div>