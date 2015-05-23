var protoCommand = {
    size: 4,
    next: ' ',
    criteria: /^([a-zA-Z0-9 _-]+)$/,
    get: function(buffer) {
        // Assuming protocol follows: (Commands are case-sensitive)
        // command
        // or
        // command param1 param2
        try {
            // If buffer size is less than min command size
            if(buffer.length < this.size) return false;
            // If the command is not followed by a next indicator
            if((buffer.toString('utf8', this.size, this.size+1) !== this.next) || (buffer.length <= this.size)) return false;
            // Commands should be within criteria
            return (this.criteria.test(buffer.toString('utf8', 0, this.size)))?buffer.toString('utf8', 0, this.size):false;
        }catch(e) {
            return e;
        }
    },
    params: function(buffer){
        // Assuming protocol follows:
        // command param1 param2 param3
        try {
            // If the command is not followed by a next indicator
            if((buffer.toString('utf8', this.size, this.size+1) !== this.next) || (buffer.length <= this.size)) return false;
            return buffer.toString('utf8', this.size+1, buffer.length).split(this.next);
        }catch(e) {
            return e;
        }
    },
    make: function(command) {
        // Size is still applicable here
        if(command.length !== this.size) return false;

        try {
            return command.toString() + this.next + Array.prototype.slice.apply(arguments).slice(1).join(this.next);
        }catch(e) {
            // Since we are dealing with protocols we don't want any Throws
            return false;
        }
    }
}

module.exports = protoCommand;
