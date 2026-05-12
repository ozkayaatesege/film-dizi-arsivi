class User{
    constructor(id,kullanici_id,sifre){
        this.id=id;
        this.kullanici_id=kullanici_id;
        this.sifre=sifre; //Veritabanındaki hash'lenmiş şifre
    }
}

module.exports=User;