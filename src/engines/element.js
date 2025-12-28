
export class _MAIN
{
    constructor(args)
    {
        if(!args || !args.type) return;

        const element = document.createElement(args.type);

        if(args.class) {
            element.classList.add(...args.class.split(' '));
        }
        
        if(args.id) {
            element.id = args.id;
        }

        if(args.parentNode) {
            args.parentNode.appendChild(element);
        }

        return element;
    }
}