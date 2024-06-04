enum Companies {
    AMZ = 'AMZ',
    FLP = 'FLP',
    SNP = 'SNP',
    MYN = 'MYN',
    AZO = 'AZO',
}

enum Categories {
    Phone = 'Phone',
    Computer = 'Computer',
    TV = 'TV',
    Earphone = 'Earphone',
    Tablet = 'Tablet',
    Charger = 'Charger',
    Mouse = 'Mouse',
    Keypad = 'Keypad',
    Bluetooth = 'Bluetooth',
    Pendrive = 'Pendrive',
    Remote = 'Remote',
    Speaker = 'Speaker',
    Headset = 'Headset',
    Laptop = 'Laptop',
    PC = 'PC',
}

interface Product {
    productName: string;
    price: number;
    rating: number;
    discount: number;
    availability: string;
}
