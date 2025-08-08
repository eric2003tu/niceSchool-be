"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampusService = void 0;
const common_1 = require("@nestjs/common");
let CampusService = class CampusService {
    getFacilities() {
        return [
            {
                id: '1',
                name: 'Library & Learning Center',
                description: 'Modern library with over 100,000 books and digital resources',
                image: 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=800',
                features: ['24/7 Study Areas', 'Computer Lab', 'Group Study Rooms', 'Digital Archive'],
            },
            {
                id: '2',
                name: 'Science & Engineering Labs',
                description: 'State-of-the-art laboratories for research and practical learning',
                image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
                features: ['Research Equipment', 'Safety Systems', 'Collaboration Spaces', 'Technology Integration'],
            },
            {
                id: '3',
                name: 'Student Recreation Center',
                description: 'Complete fitness and wellness facility for all students',
                image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
                features: ['Gymnasium', 'Swimming Pool', 'Fitness Center', 'Sports Courts'],
            },
            {
                id: '4',
                name: 'Residence Halls',
                description: 'Comfortable and modern housing for students',
                image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
                features: ['Wi-Fi', 'Common Areas', 'Study Lounges', 'Laundry Facilities'],
            },
        ];
    }
    getCampusInfo() {
        return {
            address: '123 Education Street, Learning City, LC 12345',
            size: '150 acres',
            established: 1985,
            buildings: 25,
            studentCapacity: 5000,
            parkingSpaces: 1200,
            sustainability: {
                solarPanels: true,
                greenBuildings: 8,
                recyclingProgram: true,
                energyEfficient: true,
            },
            transportation: {
                shuttleService: true,
                bikeRentals: true,
                publicTransit: 'Metro Station nearby',
                parkingPermits: true,
            },
        };
    }
    getDirections() {
        return {
            mainEntrance: '123 Education Street, Learning City, LC 12345',
            coordinates: {
                latitude: 40.7128,
                longitude: -74.0060,
            },
            drivingDirections: [
                'Take Highway 101 North to Exit 25 (Education Blvd)',
                'Turn right onto Education Boulevard',
                'Continue for 2 miles to Education Street',
                'Turn left onto Education Street',
                'Campus entrance is on the right',
            ],
            publicTransport: [
                'Take Metro Blue Line to Learning City Station',
                'Transfer to Bus Route 42 (Campus Shuttle)',
                'Get off at Nice School Main Gate stop',
            ],
            parking: {
                student: 'Student lots A-D behind dormitories',
                visitor: 'Visitor parking at Administration Building',
                staff: 'Staff lots near department buildings',
                rates: {
                    student: '$200/semester',
                    visitor: '$5/day',
                    staff: '$100/semester',
                },
            },
        };
    }
    getVirtualTour() {
        return {
            tourUrl: '/virtual-tour',
            highlights: [
                {
                    location: 'Main Quad',
                    description: 'Heart of campus with historic buildings',
                    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800',
                },
                {
                    location: 'Student Union',
                    description: 'Hub of student activities and dining',
                    image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800',
                },
                {
                    location: 'Academic Buildings',
                    description: 'Modern classrooms and lecture halls',
                    image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800',
                },
            ],
            interactiveMap: true,
            vrSupported: true,
        };
    }
};
exports.CampusService = CampusService;
exports.CampusService = CampusService = __decorate([
    (0, common_1.Injectable)()
], CampusService);
//# sourceMappingURL=campus.service.js.map