export class BaseException extends Error {
  status;
  message;
}

export class UnauthorizedException extends BaseException {
  status = 401;

  constructor(message = "Unauthorized") {
    super();
    this.message = message;
  }
}

export class NotFoundException extends BaseException {
  status = 404;

  constructor(message = "Not Found") {
    super();
    this.message = message;
  }
}

export class ForbiddenException extends BaseException {
  status = 403;

  constructor(message = "Forbidden") {
    super();
    this.message = message;
  }
}

export class ConflictException extends BaseException {
  status = 409;

  constructor(message = "Conflict") {
    super();
    this.message = message;
  }
}
