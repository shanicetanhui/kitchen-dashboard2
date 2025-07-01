"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
let OrdersService = class OrdersService {
    constructor(ordersRepository) {
        this.ordersRepository = ordersRepository;
    }
    async create(orderData) {
        const order = this.ordersRepository.create({
            items: orderData.items,
            status: 'Pending'
        });
        const savedOrder = await this.ordersRepository.save(order);
        console.log('Order created in database:', savedOrder);
        return savedOrder;
    }
    async findAll() {
        const orders = await this.ordersRepository.find({
            order: { createdAt: 'DESC' }
        });
        return orders.map(order => ({
            ...order,
            isCompleted: order.status === 'Completed'
        }));
    }
    async updateStatus(id, status) {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        await this.ordersRepository.update(id, { status });
        const updatedOrder = await this.ordersRepository.findOne({ where: { id } });
        console.log(`Order ${id} status updated to ${status}`);
        return {
            ...updatedOrder,
            isCompleted: updatedOrder.status === 'Completed'
        };
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return {
            ...order,
            isCompleted: order.status === 'Completed'
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map