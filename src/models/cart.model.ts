export class CartItem {    
    Id?: string;
    ProductId: string;
    ProductName: string;
    ProductSeName?: string;
    UnitPrice: number;
    SubTotal?: number;
    Discount?: number;
    Quantity: number;
    AllowedQuantities: [number];
    AttributeInfo?: any;
    RecurringInfo?: any;
    RentalInfo?: any;
    AllowItemEditing: boolean;
    Warnings: any;
    CustomProperties: {};
    Picture: {
        ImageUrl: string;
        FullSizeImageUrl?: string;
        Title?: string;
        AlternateText?: string;
        CustomProperties?: any
    };
    isQuantityUpdated: boolean;

    constructor() {
        this.Picture = { ImageUrl: '', Title: '', FullSizeImageUrl:'' };
    }
}