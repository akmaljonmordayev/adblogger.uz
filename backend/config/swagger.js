const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ADBlogger API',
      version: '1.0.0',
      description: 'ADBlogger — blogger va bizneslarni birlashtiruvchi platforma REST API',
      contact: { name: 'ADBlogger', email: 'admin@adbloger.uz' },
    },
    servers: [
      { url: 'http://localhost:5001/api/v1', description: 'Development' },
      { url: 'https://api.adbloger.uz/v1', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ── Auth ──────────────────────────────────────────────────────────
        RegisterInput: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: { type: 'string', example: 'Akmal' },
            lastName:  { type: 'string', example: 'Toshmatov' },
            email:     { type: 'string', example: 'akmal@mail.com' },
            phone:     { type: 'string', example: '+998901234567' },
            password:  { type: 'string', example: 'password123' },
            role:      { type: 'string', enum: ['user', 'blogger', 'business'], example: 'blogger' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', example: 'akmal@mail.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token:   { type: 'string' },
            user: {
              type: 'object',
              properties: {
                _id:       { type: 'string' },
                firstName: { type: 'string' },
                lastName:  { type: 'string' },
                email:     { type: 'string' },
                role:      { type: 'string' },
                avatar:    { type: 'string' },
              },
            },
          },
        },
        // ── User ──────────────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id:       { type: 'string' },
            firstName: { type: 'string' },
            lastName:  { type: 'string' },
            email:     { type: 'string' },
            phone:     { type: 'string' },
            role:      { type: 'string', enum: ['user', 'blogger', 'business', 'admin'] },
            avatar:    { type: 'string' },
            isVerified:{ type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        // ── Blogger ───────────────────────────────────────────────────────
        Blogger: {
          type: 'object',
          properties: {
            _id:            { type: 'string' },
            user:           { $ref: '#/components/schemas/User' },
            handle:         { type: 'string', example: '@akmal_blogger' },
            bio:            { type: 'string' },
            platforms:      { type: 'array', items: { type: 'string', enum: ['instagram','youtube','telegram','tiktok'] } },
            followers:      { type: 'number' },
            followersRange: { type: 'string', example: '50K-100K' },
            engagementRate: { type: 'number' },
            categories:     { type: 'array', items: { type: 'string' } },
            services:       { type: 'array', items: { type: 'string' } },
            pricing: {
              type: 'object',
              properties: {
                post:  { type: 'number' },
                story: { type: 'number' },
                video: { type: 'number' },
              },
            },
            rating:      { type: 'number' },
            reviewCount: { type: 'number' },
            isVerified:  { type: 'boolean' },
          },
        },
        // ── Ad ────────────────────────────────────────────────────────────
        Ad: {
          type: 'object',
          properties: {
            _id:         { type: 'string' },
            user:        { $ref: '#/components/schemas/User' },
            type:        { type: 'string', enum: ['blogger', 'business'] },
            title:       { type: 'string' },
            description: { type: 'string' },
            platforms:   { type: 'array', items: { type: 'string' } },
            status:      { type: 'string', enum: ['pending','approved','rejected','active','completed'] },
            views:       { type: 'number' },
            createdAt:   { type: 'string', format: 'date-time' },
          },
        },
        // ── BlogPost ──────────────────────────────────────────────────────
        BlogPost: {
          type: 'object',
          properties: {
            _id:         { type: 'string' },
            title:       { type: 'string' },
            slug:        { type: 'string' },
            excerpt:     { type: 'string' },
            content:     { type: 'string' },
            coverImage:  { type: 'string' },
            author:      { $ref: '#/components/schemas/User' },
            category:    { type: 'string' },
            tags:        { type: 'array', items: { type: 'string' } },
            readTime:    { type: 'number' },
            views:       { type: 'number' },
            isPublished: { type: 'boolean' },
            createdAt:   { type: 'string', format: 'date-time' },
          },
        },
        // ── Category ──────────────────────────────────────────────────────
        Category: {
          type: 'object',
          properties: {
            _id:          { type: 'string' },
            name:         { type: 'string', example: 'Tech' },
            slug:         { type: 'string', example: 'tech' },
            description:  { type: 'string' },
            icon:         { type: 'string' },
            color:        { type: 'string' },
            bloggerCount: { type: 'number' },
            isFeatured:   { type: 'boolean' },
          },
        },
        // ── Campaign ──────────────────────────────────────────────────────
        Campaign: {
          type: 'object',
          properties: {
            _id:         { type: 'string' },
            blogger:     { type: 'string' },
            business:    { type: 'string' },
            status:      { type: 'string', enum: ['proposal','negotiating','agreed','in_progress','completed','cancelled'] },
            agreedPrice: { type: 'number' },
            startDate:   { type: 'string', format: 'date-time' },
            endDate:     { type: 'string', format: 'date-time' },
          },
        },
        // ── Review ────────────────────────────────────────────────────────
        Review: {
          type: 'object',
          properties: {
            _id:      { type: 'string' },
            blogger:  { type: 'string' },
            reviewer: { $ref: '#/components/schemas/User' },
            rating:   { type: 'number', minimum: 1, maximum: 5 },
            comment:  { type: 'string' },
          },
        },
        // ── Contact ───────────────────────────────────────────────────────
        ContactInput: {
          type: 'object',
          required: ['name', 'email', 'subject', 'message'],
          properties: {
            name:    { type: 'string', example: 'Akmal' },
            email:   { type: 'string', example: 'akmal@mail.com' },
            phone:   { type: 'string', example: '+998901234567' },
            subject: { type: 'string', example: 'Hamkorlik' },
            message: { type: 'string', example: 'Salom, hamkorlik qilmoqchiman' },
          },
        },
        // ── FAQ ───────────────────────────────────────────────────────────
        FAQ: {
          type: 'object',
          properties: {
            _id:      { type: 'string' },
            question: { type: 'string' },
            answer:   { type: 'string' },
            category: { type: 'string' },
            order:    { type: 'number' },
          },
        },
        // ── Career ────────────────────────────────────────────────────────
        Career: {
          type: 'object',
          properties: {
            _id:         { type: 'string' },
            title:       { type: 'string' },
            department:  { type: 'string' },
            location:    { type: 'string' },
            type:        { type: 'string' },
            description: { type: 'string' },
            isActive:    { type: 'boolean' },
          },
        },
        // ── Error ────────────────────────────────────────────────────────
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Xatolik yuz berdi' },
          },
        },
        // ── Pagination ───────────────────────────────────────────────────
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            results: { type: 'number' },
            total:   { type: 'number' },
            page:    { type: 'number' },
            limit:   { type: 'number' },
            data:    { type: 'array', items: {} },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
