// src/Providers/EventServiceProvider.js

import { SendEmailVerification } from '../app/Events/Mails/SendEmailVerification.js';
import { EmailSendByTemplate } from '../app/Events/Mails/EmailSendByTemplate.js';

import { SendEmailVerificationListener } from '../app/Listeners/Mails/SendEmailVerificationListener.js';
import { EmailSendByTemplateListener } from '../app/Listeners/Mails/EmailSendByTemplateListener.js';


import { CategoryObserver } from '../app/Observers/CategoryObserver.js';
import { ShopObserver } from '../app/Observers/ShopObserver.js';
import { ShopLocationObserver } from '../app/Observers/ShopLocationObserver.js';
import { ProductObserver } from '../app/Observers/ProductObserver.js';
import { UserObserver } from '../app/Observers/UserObserver.js';
import { BrandObserver } from '../app/Observers/BrandObserver.js';
import { TicketObserver } from '../app/Observers/TicketObserver.js';
import { GalleryObserver } from '../app/Observers/GalleryObserver.js';
import { OrderObserver } from '../app/Observers/OrderObserver.js';
import { CountryObserver } from '../app/Observers/CountryObserver.js';
import { CityObserver } from '../app/Observers/CityObserver.js';
import { AreaObserver } from '../app/Observers/AreaObserver.js';
import { PropertyGroupObserver } from '../app/Observers/PropertyGroupObserver.js';
import { CartDetailProductObserver } from '../app/Observers/CartDetailProductObserver.js';
import { UserCartObserver } from '../app/Observers/UserCartObserver.js';

import Category from '../models/Category.js';
import Shop from '../models/Shop.js';
import ShopLocation from '../models/ShopLocation.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Brand from '../models/Brand.js';
import Ticket from '../models/Ticket.js';
import Gallery from '../models/Gallery.js';
import Order from '../models/Order.js';
import Country from '../models/Country.js';
import City from '../models/City.js';
import Area from '../models/Area.js';
import PropertyGroup from '../models/PropertyGroup.js';
import CartDetailProduct from '../models/CartDetailProduct.js';
import UserCart from '../models/UserCart.js';

class EventServiceProvider {
  constructor() {
    this.listeners = new Map([
      [Registered, [SendEmailVerificationNotification]],
      [SendEmailVerification, [SendEmailVerificationListener]],
      [EmailSendByTemplate, [EmailSendByTemplateListener]],
    ]);
  }

  boot() {
    Category.observe(CategoryObserver);
    Shop.observe(ShopObserver);
    ShopLocation.observe(ShopLocationObserver);
    Product.observe(ProductObserver);
    User.observe(UserObserver);
    Brand.observe(BrandObserver);
    Ticket.observe(TicketObserver);
    Gallery.observe(GalleryObserver);
    Order.observe(OrderObserver);
    Country.observe(CountryObserver);
    City.observe(CityObserver);
    Area.observe(AreaObserver);
    PropertyGroup.observe(PropertyGroupObserver);
    CartDetailProduct.observe(CartDetailProductObserver);
    UserCart.observe(UserCartObserver);
  }

  shouldDiscoverEvents() {
    return false;
  }
}

export default EventServiceProvider;
