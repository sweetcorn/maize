;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $ = require('jQuery');
var Backbone = require('backbone');
Backbone.$ = $;

var AppRouter = require('./backbone/routers/app');

require('templates')(require('handlebars'));

module.exports = (function (options) {
  options = options || {};

  var router = new AppRouter();

  // start listening for path changes
  options.pushState = true;
  $(document).ready(function(){
    Backbone.history.start(options);
  });
})();
},{"./backbone/routers/app":5}],2:[function(require,module,exports){
var Backbone = require('backbone');

var Container = require('../models/container');
var Containers;



Containers = module.exports = Backbone.Collection.extend({

  model: Container

})
},{"../models/container":3}],3:[function(require,module,exports){
var Backbone = require('backbone');

var Container;




Container = module.exports = Backbone.Model.extend({

  fetch: function() {
    this.trigger('sync');
  }

});
},{}],4:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');

var Containers = require('../collections/containers');
var json = require('../../../json');
var Edition;




Edition = module.exports = Backbone.Model.extend({

  defaults: {
    id: 'cac2b27c-fa00-400d-a644-ba6408b2566d'
  }

, fetch: function() {
    var data = json.editions[this.get('id')];
    var edition = json.editions[this.get('id')].edition;

    this.set(edition);

    var containers = _.map(data.containers, function(container){
      return _.extend(container, {edition: _.pick(edition, 'id', 'title')});
    });

    this.containers = new Containers(containers);

    this.trigger('sync');
  },

})
},{"../../../json":19,"../collections/containers":2,"underscore":22}],5:[function(require,module,exports){
var Backbone = require('backbone');

var Edition = require('../models/edition');
var Container = require('../models/container');
var PageView = require('../views/page');
var AppRouter;




AppRouter = module.exports = Backbone.Router.extend({

  routes: {
    '': 'index',
    'editions/:id': 'edition',
    'editions/:id/containers/:id': 'container'
  }

, renderView: function(editionId, containerId) {
    var edition = (editionId) ? new Edition({id: editionId}) : new Edition();
    var _this = this;

    edition.on('sync', function() {
      var _edition = edition;
      var container = (containerId) ? edition.containers.findWhere({id: containerId}) : edition.containers.models[0];
      var __this = _this;

      container.on('sync', function(){
        __this.navigate('/editions/' + _edition.id + '/containers/' + container.id, {replace: true});
        new PageView({el: $('.js-body'), edition: _edition, container: container});
      });

      container.fetch();
    });

    edition.fetch();
  }

, index: function() {
    this.renderView()
  }

, edition: function(editionId) {
    this.renderView(editionId);
  }

, container: function(editionId, containerId) {
    this.renderView(editionId, containerId);
  }

});

},{"../models/container":3,"../models/edition":4,"../views/page":8}],6:[function(require,module,exports){
var Backbone = require('backbone');
var _ = require('underscore');

var TemplateView = require('./template');
var ContainerView;




ContainerView = module.exports = Backbone.View.extend({

  initialize: function(options) {
    this.render();
  }

, render: function() {
    var _this = this;

    var edition = this.model.get('edition');
    var container = _.pick(this.model.attributes, 'id', 'title', 'number');

    _.each(this.model.get('pages'), function(page){
      var attributes = _.extend(page, {edition: edition, container: container});
      var model = new Backbone.Model(attributes);
      var view = new TemplateView({model: model});
      _this.$el.append(view.render().el);
    });
  }

})
},{"./template":9,"underscore":22}],7:[function(require,module,exports){
var Backbone = require('backbone');

var Edition = require('../models/edition.js');
var NavView;



NavView = module.exports = Backbone.View.extend({

  template: function() {
    return JST.nav;
  }

, initialize: function(options) {
    this.render();
  }

, render: function() {
    var html = this.template()(this.model.toJSON());
    this.$el.html(html);

    return this;
  }

})
},{"../models/edition.js":4}],8:[function(require,module,exports){
var Backbone = require('backbone');

var NavView = require('./nav');
var ContainerView = require('./container');
var PageView;




PageView = module.exports = Backbone.View.extend({

  initialize: function(options) {
    this.render();

    new NavView({el: $('.js-nav-container'), model: options.edition});
    new ContainerView({el: this.$('.js-main'), model: options.container});
  }

});
},{"./container":6,"./nav":7}],9:[function(require,module,exports){
var Backbone = require('backbone');

var BaseView;




BaseView = module.exports = Backbone.View.extend({

  template: function() {
    return JST['pages.' + this.model.get('template').toLowerCase()];
  }

, render: function() {
    var html = this.template()(this.model.toJSON());
    this.$el.html(html);
    this.setElement(this.$('section'))

    return this;
  }

});
},{}],10:[function(require,module,exports){
module.exports={
    "id": "cac2b27c-fa00-400d-a644-ba6408b2566d",
    "title": "Smarter Cloud",
    "containers": [
        {
            "id": "0af17960-db7a-4551-a6f0-e6ed5145d9e8",
            "number": "01",
            "title": "Ideas on a page"
        },
        {
            "id": "d098d935-470e-456d-ae30-294b576f28e0",
            "number": "02",
            "title": "Three important shifts in the world"
        },
        {
            "id": "e9ddaad3-83c6-4662-a461-4be70d765846",
            "number": "03",
            "title": "Three must-reads"
        },
        {
            "id": "95017953-cca4-4d11-acb8-13ec5d657cde",
            "number": "04",
            "title": "The new way forward"
        },
        {
            "id": "49bb146c-f77e-438a-8310-d29c48cfd32f",
            "number": "05",
            "title": "The new outcomes"
        },
        {
            "id": "e81ca67c-e932-428f-b83e-fc1d73cd1f13",
            "number": "06",
            "title": "Important conversations to have"
        },
        {
            "id": "9b271ebc-7294-47e0-a4a4-efa1bd903e3e",
            "number": "07",
            "title": "Opportunities for innovation"
        },
        {
            "id": "45713ccf-bfdf-4a76-abe9-1337de360833",
            "number": "08",
            "title": "The IBM industry perspective"
        },
        {
            "id": "8a18a90e-e55d-4c1c-955c-8ef66e27e4a5",
            "number": "09",
            "title": "Why IBM beats the competition"
        },
        {
            "id": "fb4a9e17-6665-4d48-a964-a82c50cde47a",
            "number": "10",
            "title": "The new vocabulary"
        },
        {
            "id": "ccab7c6e-ec15-41d1-abcf-2f4a93c1ede9",
            "number": "11",
            "title": "Why infrastructure matters"
        },
        {
            "id": "e8b0be7b-eebc-4a4c-9824-a78238947eda",
            "number": "12",
            "title": "The system choices"
        },
        {
            "id": "ab2eecc6-a50e-41e9-ba8a-f6cc2e15db6e",
            "number": "13",
            "title": "Partnering options to explore"
        }
    ]
}
},{}],11:[function(require,module,exports){
module.exports={
    "id": "0af17960-db7a-4551-a6f0-e6ed5145d9e8",
    "number": "01",
    "title": "Ideas on a page",
    "pages": [
        {
            "id": "4edbc75e-4568-410a-a94f-ef396d15a453",
            "template": "I1",
            "body": "How you should be thinking about cloud, and where to start",
            "background": {
                "url": "image.jpg",
                "url@2x": "image@2x.jpg"
            }
        },
        {
            "id": "3b60e3d3-8e64-42c7-9fcb-75a99e433467",
            "template": "T1",
            "title": "Cloud is a business growth engine. Beyond rethinking IT, it is a path for reinventing business."
        },
        {
            "id": "16147468-959e-495f-92f5-43fba5c8a1c2",
            "template": "A1",
            "title": "Get faster",
            "body": "To drive innovation and meet the increasing expectations of consumers, employees, suppliers and partners, organizations must continuously and more quickly develop, deploy and improve applications and services.",
            "items": [
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "72%",
                    "text": "of CEOs surveyed see the need to improve response time to market.\n\nBased on IBM PuresystemsTM research."
                },
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "58%",
                    "text": "of companies move to the private cloud to gain agility and speed.\n\nFpweb.net, \"value of the private cloud\" infographic, may 14, 2013."
                }
            ]
        },
        {
            "id": "0d40e813-f913-43b8-8d17-c85b2248f0a9",
            "template": "A1",
            "title": "Get empowered",
            "body": "It is under pressure to rapidly deliver intuitive, on-demand access to business services across the enterprise and to speed application and service deployment by enabling developers to create their own development and test environments.",
            "items": [
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "45%",
                    "text": "of CFOs need improved technology support for the quality of the data used for business decisions.\n\nFinancial executives international, \"the CFO's top technology imperatives,\" John e. Van decker and William m. Sinnett, June 2013."
                },
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "36%",
                    "text": "of business leaders manage cloud services without involvement or support of it.\n\nIBM center for applied insights, cloud global study, 2013."
                }
            ]
        },
        {
            "id": "4f3d113f-d2f0-4056-b811-a80b78de1853",
            "template": "A1",
            "title": "Get efficient",
            "body": "Organizations must improve the economics of it, using self-service business services and applications with a use-based payment model, adding new capabilities and capacity as needed, and maximizing the value of existing infrastructure.",
            "items": [
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "76%",
                    "text": "of it decision makers are concerned or very concerned by the rising pressure to reduce costs.\n\nForrester consulting, challenging the status quo on maintenance contracts and refresh cycles to lower costs, may 2013."
                },
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "31%",
                    "text": "of executives surveyed cited cloud's ability to reduce fixed it costs and shift to a more variable \"pay as you go\" cost structure as a top benefit.\n\nIBM, the power of cloud: driving business model innovation, February 2012."
                }
            ]
        }
    ]
}
},{}],12:[function(require,module,exports){
module.exports={
    "id": "95017953-cca4-4d11-acb8-13ec5d657cde",
    "number": "04",
    "title": "The new way forward",
    "pages": [
        {
            "id": "7892ca11-dfd4-4870-bc67-e912ba7f9e06",
            "template": "I1",
            "body": "What IBM and our clients can achieve together-laid out in a common frame",
            "background": {
                "url": "image.jpg",
                "url@2x": "image@2x.jpg"
            }
        },
        {
            "id": "585b469d-79d5-4481-86cc-abe617721093",
            "template": "M4",
            "graphic": "image.svg",
            "links": [
                {
                    "color": {
                        "r": "255",
                        "g": "255",
                        "b": "255"
                    },
                    "text": "Reinvent restlessly",
                    "icon": "icon.svg",
                    "target": {
                        "id": "1167ebf4-3970-4c61-a6af-1c31f88cc0e5",
                        "template": "A3",
                        "title": {
                            "color": {
                                "r": "0",
                                "g": "0",
                                "b": "0"
                            },
                            "text": "Reinvent restlessly"
                        },
                        "subtitle": "Innovate more than products and services-innovate to reinvent your business.",
                        "items": [
                            {
                                "title": "What it means",
                                "body": "The influence of cloud permeates organizational cultures, driving a radical rethinking of how business leaders approach their roles and, ultimately, how work gets done. Cloud can speed access to trusted information and insights, ease collaboration, and enable the relentless pursuit of better business outcomes."
                            },
                            {
                                "title": "Who Benefits",
                                "body": "C-suite\nProduct management\nEnterprise architects\nApplication developers"
                            }
                        ],
                        "button": {
                            "title": "Questions to think about",
                            "target": {
                                "id": "9b3bd881-d5e4-4297-b308-fab310d363ee",
                                "template": "PO7",
                                "questions": [
                                    {
                                        "text": "Is your organizational culture open to reinvention?"
                                    },
                                    {
                                        "text": "How does your infrastructure enable agility to support rapid changes to processes and systems?"
                                    },
                                    {
                                        "text": "How has your senior leadership demonstrated commitment to continuous top-down and bottom-up innovation?"
                                    },
                                    {
                                        "text": "What degree of expertise and acumen does your workforce have to imagine and implement change?"
                                    },
                                    {
                                        "text": "How might cloud technologies change the way you work with partners and suppliers?"
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    "color": {
                        "r": "255",
                        "g": "255",
                        "b": "255"
                    },
                    "text": "Empower through insights",
                    "icon": "icon.svg",
                    "target": {
                        "id": "814b552b-05c7-4f16-ac5d-00ea2528f279",
                        "template": "A3",
                        "title": {
                            "color": {
                                "r": "0",
                                "g": "0",
                                "b": "0"
                            },
                            "text": "Empower through insights"
                        },
                        "subtitle": "Deepen knowledge of customers, partners, suppliers and processes",
                        "items": [
                            {
                                "title": "What it means",
                                "body": "As new technologies create new types and sources of data, leaders are using analytics to inform and empower workers to seize emerging opportunities. Through cloud-based analytics, business users can deepen their understanding of customers, competitors and the complete value chain."
                            },
                            {
                                "title": "Who Benefits",
                                "body": "Sales\nCustomer service\nProcurement\nSupply chain\nMerchandising\nHuman resources"
                            }
                        ],
                        "button": {
                            "title": "Questions to think about",
                            "target": {
                                "id": "0cc09975-8931-4cf5-bee4-ae80888cdea1",
                                "template": "PO7",
                                "questions": [
                                    {
                                        "text": "What have you done to enable your organization to deliver services that anticipate customer needs?"
                                    },
                                    {
                                        "text": "What insights do you know are out there in the data, if only you could bring together and analyze the right data?"
                                    },
                                    {
                                        "text": "What could your organization do differently if business users had self-service access to analytics applications in the cloud?"
                                    },
                                    {
                                        "text": "What steps has your organization taken to integrate its analytics and cloud strategies?"
                                    },
                                    {
                                        "text": "What are you doing to enable your organization to anticipate customer needs?"
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    "color": {
                        "r": "255",
                        "g": "255",
                        "b": "255"
                    },
                    "text": "Orchestrate dynamic clouds",
                    "icon": "icon.svg",
                    "target": {
                        "id": "1a55487b-dd3a-4377-98fc-1fdcfa4d6338",
                        "template": "A3",
                        "title": {
                            "color": {
                                "r": "0",
                                "g": "0",
                                "b": "0"
                            },
                            "text": "Orchestrate dynamic clouds"
                        },
                        "subtitle": "Improve business processes and security, and enhance agility and responsiveness",
                        "items": [
                            {
                                "title": "What it means",
                                "body": "As requirements change, opportunities are identified or threats arise, it must be ready. In the competitive marketplace, advantage will go to those who can adapt instantly-dynamically consuming and delivering critical capabilities through the right combination of public, private and hybrid clouds."
                            },
                            {
                                "title": "Who Benefits",
                                "body": "Procurement\nSupply chain\nMerchandising\nMarketing\nIt\nHuman resources"
                            }
                        ],
                        "button": {
                            "title": "Questions to think about",
                            "target": {
                                "id": "b3bb9cf4-ae16-43d6-a9ce-61bc9d258a59",
                                "template": "PO7",
                                "questions": [
                                    {
                                        "text": "What are you not able to deliver through the cloud?"
                                    },
                                    {
                                        "text": "How far along are you in using a variety of cloud models-public, private and hybrid?"
                                    },
                                    {
                                        "text": "How do you determine where to run a given process or application from a business and technology perspective?"
                                    },
                                    {
                                        "text": "Which cloud-based business solutions and services are you currently using? Why those?"
                                    },
                                    {
                                        "text": "What appeals to you most about cloud services? What concerns do you have?"
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        }
    ]
}
},{}],13:[function(require,module,exports){
module.exports={
    "id": "ccab7c6e-ec15-41d1-abcf-2f4a93c1ede9",
    "number": "11",
    "title": "Why infrastructure matters",
    "pages": [
        {
            "id": "4980b4d0-7eaf-4610-9890-e92283a544ff",
            "template": "I1",
            "body": "Exploring the intersection of business outcomes and infrastructure strategies",
            "background": {
                "url": "image.jpg",
                "url@2x": "image@2x.jpg"
            }
        },
        {
            "id": "5cc7a9e7-cf7f-4e9f-a4e8-2634e6d9a8f1",
            "template": "T2",
            "title": "It matters because business outcomes matter and new outcomes entail new demands.",
            "body": "\"A wide range of innovations is happening at the infrastructure layer, as continued hardware improvements drive new capabilities for compute, storage, and networking and combine with new innovations in software. These will recombine in numerous ways to create much more capable infrastructure and application platforms\"\n\n-brian hopkins et al., forrester research, february 2013"
        },
        {
            "id": "befb425a-e1db-4cbd-8425-76a09e3e09e3",
            "template": "A3",
            "title": {
                "color": {
                    "r": "0",
                    "g": "0",
                    "b": "0"
                },
                "text": "Wimbledon"
            },
            "subtitle": "A premier tennis event needed to deliver innovative ways to share the excitement of the tournament and engage millions of fans globally. A website that leveraged cloud with social and mobile capabilities was the answer.",
            "items": [
                {
                    "title": "Why this client took action",
                    "body": "Social and mobile trends have driven new customer experience expectations, particularly at sporting events. Failure to deliver a seamless interactive experience can lead to lower satisfaction and loss of potential revenue."
                },
                {
                    "title": "Business outcome",
                    "body": "For two weeks every year, 17 million visitors enjoy an innovative, interactive web experience that satisfies an increasingly sophisticated fan base."
                },
                {
                    "title": "Requirements",
                    "body": "In 2012, 40 percent of website visits were via mobile devices, and downloads of a mobile app doubled over the previous year. Mobile demands added pressure to the infrastructure, requiring continuous availability and security, while cost-per-site-visit figures needed to go down."
                }
            ],
            "button": null
        },
        {
            "id": "5424bb9b-c927-4fb1-ae06-e546957cbdfc",
            "template": "A3",
            "title": {
                "color": {
                    "r": "0",
                    "g": "0",
                    "b": "0"
                },
                "text": "South american financial organization"
            },
            "subtitle": "A financial institution's growth was being hindered by its inability to quickly deliver and launch new client services in a competitive marketplace. It needed a scalable infrastructure that it could easily and rapidly provision to deliver new services, such as mobile banking apps and web-based self-services.",
            "items": [
                {
                    "title": "Why this client took action",
                    "body": "An inefficient business platform can't meet the expectations of new customers looking to bank when, where and how they want, so neither banking revenues nor profits grow."
                },
                {
                    "title": "Business outcome",
                    "body": "Through cloud services and other technologies, the financial organization supported a 600 percent growth rate in mobile transactions and a 200 percent upsurge in web transactions while saving usd1.5 million in operational costs."
                },
                {
                    "title": "Requirements",
                    "body": "To create new services quickly, servers needed to be provisioned in seconds, and the infrastructure needed to scale rapidly. The client also had to reduce administrative effort, improve manageability, lower software maintenance expenses and significantly reduce energy."
                }
            ],
            "button": null
        },
        {
            "id": "bff1e921-709d-47d0-aac6-340ada6ecd4f",
            "template": "A3",
            "title": {
                "color": {
                    "r": "0",
                    "g": "0",
                    "b": "0"
                },
                "text": "Computer services company"
            },
            "subtitle": "A european computer services company needed a cloud storage service that could help differentiate it in the marketplace and add value to its portfolio. The business needed a low-cost, scalable infrastructure to support this valuable new offering and enable customers to share and synchronize data in a secure and convenient way.",
            "items": [
                {
                    "title": "Why this client took action",
                    "body": "Self-service capabilities hinge on a responsive infrastructure; slow performance can negatively affect the user experience and customer satisfaction."
                },
                {
                    "title": "Business outcome",
                    "body": "In less than two months, the company launched an innovative cloud storage service with far lower  energy costs per petabyte than they had achieved previously.\n\nCustomers can use self-service capabilities to provision storage servers in just 30 seconds and access files in only 15 seconds."
                },
                {
                    "title": "Requirements",
                    "body": "These capabilities require a scalable, security-rich infrastructure that is easy and cost-effective to manage and that supports granular billing."
                }
            ],
            "button": null
        }
    ]
}
},{}],14:[function(require,module,exports){
module.exports={
    "id": "e8b0be7b-eebc-4a4c-9824-a78238947eda",
    "number": "12",
    "title": "The system choices",
    "pages": [
        {
            "id": "654ebf7b-6b2a-4344-b5de-7b009281a201",
            "template": "I1",
            "body": "Explore how ibm delivers key infrastructure characteristics and creates new value.",
            "background": {
                "url": "image.jpg",
                "url@2x": "image@2x.jpg"
            }
        },
        {
            "id": "66012181-10ac-4b19-95ba-cb15bb3adb0d",
            "template": "M3",
            "body": "Today's industry leaders need to be armed with the right infrastructure to address the ever-changing needs and expectations of their customers and organizations. To claim leadership, their it systems need to demonstrate the right characteristics. Explore how ibm can help.",
            "buttons": [
                {
                    "title": "Resiliency matters",
                    "target": {
                        "id": "e6ac0abb-1dc8-4dbe-a714-7e41f55bd79b",
                        "template": "PO3",
                        "title": "Resiliency matters",
                        "body": "A dynamic, responsive, security-rich infrastructure that rapidly scales up and down",
                        "items": [
                            {
                                "title": "How ibm delivers on resiliency",
                                "body": "Advanced memory utilization and caching offer near-linear scalability (scale up to 100,000 virtual machines on a single system). Resource management across physical and virtual infrastructures can scale in accordance with business needs. Robust security governance tools and audit processes help reduce risk."
                            },
                            {
                                "title": "The value to the cio",
                                "body": "A rich, interactive experience can increase revenue and user satisfaction."
                            }
                        ]
                    }
                },
                {
                    "title": "Efficiency matters",
                    "target": {
                        "id": "87f91e8a-c03a-4350-8489-0e1fdd54b11b",
                        "template": "PO3",
                        "title": "Efficiency matters",
                        "body": "Effective utilization of it infrastructure",
                        "items": [
                            {
                                "title": "How ibm delivers on efficiency",
                                "body": "Integrated management and automation help simplify it management, reduce administrative time and improve efficiency while reducing costs. Repeatable, proven patterns of expertise can more quickly build innovative solutions with logical representations of recurring topologies for given requirements."
                            },
                            {
                                "title": "The value to the cio",
                                "body": "New client services are rapidly developed, while operational costs decrease."
                            }
                        ]
                    }
                },
                {
                    "title": "Responsiveness matters",
                    "target": {
                        "id": "63a360b7-95fb-4fbc-b051-7c5f493bf566",
                        "template": "PO3",
                        "title": "Responsiveness matters",
                        "body": "An integrated, modular infrastructure that is rapidly deployable and highly scalable",
                        "items": [
                            {
                                "title": "How ibm delivers on responsiveness",
                                "body": "A deeply integrated computing, storage and networking system can rapidly deploy cloud services in minutes instead of days. An integrated set of capabilities helps build security-rich private clouds and cloud delivery platforms for managed service providers."
                            },
                            {
                                "title": "The value to the cio",
                                "body": "A cost-competitive, highly responsive solution is quickly brought to the marketplace."
                            }
                        ]
                    }
                }
            ]
        }
    ]
}
},{}],15:[function(require,module,exports){
module.exports={
    "id": "e9ddaad3-83c6-4662-a461-4be70d765846",
    "number": "03",
    "title": "Three must-reads",
    "pages": [
        {
            "id": "1f716f90-05c9-46f0-9f60-dd6b7ab34cc9",
            "template": "I1",
            "body": "A powerful way to increase the collective expertise",
            "background": {
                "url": "image.jpg",
                "url@2x": "image@2x.jpg"
            }
        },
        {
            "id": "7bb25b8b-fcee-48f9-91b1-ad120c294d0c",
            "template": "M6",
            "links": [
                {
                    "id": "fb24a3a1-fd50-46d3-9ee1-608569fcfa80",
                    "text": "The power of cloud: Driving business model innovation",
                    "target": {
                        "id": "cdd95ca4-a8b8-4a25-8427-91675a4adc99",
                        "template": "PO6",
                        "title": "The power of cloud: Driving business model innovation",
                        "body": "The IBM Institute for Business Value, through a survey conducted in conjunction with the Economist Intelligence Unit, discovers how global business and technology executives see the game-changing potential of cloud.",
                        "link": {
                            "text": "IBM Institute for Business Value executive report, February 2012",
                            "target": "http://www-935.ibm.com/services/us/gbs/thoughtleadership/ibv-power-of-cloud.html"
                        }
                    }
                },
                {
                    "id": "d24d6cb8-fead-484b-b2ac-2c9aed832c7e",
                    "text": "\"How Cloud Computing Is Changing IT Organizations\"",
                    "target": {
                        "id": "3ba5f79e-92f0-46d2-9aa3-747223ba6932",
                        "template": "PO6",
                        "title": "\"How Cloud Computing Is Changing IT Organizations\"",
                        "body": "In investigating the effect of cloud on corporate IT departments, Deloitte Insights found a major shift in the responsibilities of IT professionals, including the ability to focus on high-value activities that enable new insights and innovation.",
                        "link": {
                            "text": "CIO Journal – Deloitte Insights, April 29, 2013",
                            "target": "http://deloitte.wsj.com/cio/2013/04/29/how-cloud-computing-is-changing-it-organizations/"
                        }
                    }
                },
                {
                    "id": "6cc957e7-2e0f-43be-a4a6-dbde2b577e48",
                    "text": "Embrace the Inevitable: Six Imperatives to Prepare Your Company for Cloud Computing",
                    "target": {
                        "id": "e379fcf1-6311-4d12-b4bc-87d39df84dca",
                        "template": "PO6",
                        "title": "Embrace the Inevitable: Six Imperatives to Prepare Your Company for Cloud Computing",
                        "body": "In reviewing cloud adoption at 46 leading companies, the MIT Center for Information Systems Research (CISR) explores the six critical factors your company needs to implement to maximize the benefits of cloud computing.",
                        "link": {
                            "text": "MIT Sloan Management CISR research briefing, October 18, 2012",
                            "target": "http://cisr.mit.edu/blog/documents/2012/10/18/2012_1001_embraceinevitable_mooneyrossphipps-pdf/"
                        }
                    }
                }
            ]
        }
    ]
}
},{}],16:[function(require,module,exports){
module.exports={
    "id": "fb4a9e17-6665-4d48-a964-a82c50cde47a",
    "number": "10",
    "title": "The new vocabulary",
    "pages": [
        {
            "id": "726a3679-dae8-447b-bf02-9194114f7c10",
            "template": "I1",
            "body": "Master the terminology so you can frame the conversation.",
            "background": {
                "url": "image.jpg",
                "url@2x": "image@2x.jpg"
            }
        },
        {
            "id": "b98660fc-1f74-45d0-916b-4d6477299282",
            "template": "M7",
            "links": [
                {
                    "id": "ad6a2a90-39b2-4445-9317-c8f0e2d92962",
                    "text": "Cloud",
                    "target": {
                        "id": "9a0921e5-27c0-4ca8-be3e-70d27bef2d3a",
                        "template": "PO1",
                        "title": "Cloud:",
                        "body": "Cloud computing is a model for enabling ubiquitous, convenient network access on demand to a shared pool of configurable computing resources. Cloud technology can be rapidly provisioned and released with minimal management effort or service provider interaction."
                    }
                },
                {
                    "id": "f21b29fb-0562-4935-aa2d-c79237412bce",
                    "text": "Private cloud",
                    "target": {
                        "id": "38f1ab73-8355-4509-847f-09dc4a835365",
                        "template": "PO1",
                        "title": "Private cloud:",
                        "body": "A private cloud is offered over the Internet or over a private internal network to select users; it is not available to the general public. This provides greater choice and control for enterprises, especially for supporting mission-critical applications."
                    }
                },
                {
                    "id": "bb21ec15-9fdc-486c-b5aa-668e03f97cf9",
                    "text": "Public cloud",
                    "target": {
                        "id": "851c99b4-1a8c-41ab-b1a8-9cfab9261a31",
                        "template": "PO1",
                        "title": "Public cloud:",
                        "body": "Public cloud is offered over the public Internet and available to anyone who wants to purchase the service. It is characterized by rapid provisioning, pay-as-you-go pricing, and high levels of scalability and flexibility."
                    }
                },
                {
                    "id": "7b2ad46f-6307-4413-adf6-a78eaee1c8d7",
                    "text": "Hybrid cloud",
                    "target": {
                        "id": "44745b6d-af9a-4c42-8ab9-337fbad9b6b4",
                        "template": "PO1",
                        "title": "Hybrid cloud:",
                        "body": "Hybrid cloud represents a combination of multiple delivery models, potentially including public cloud, private cloud and traditional on-premises models. It is one of the most common cloud models for most enterprises because their different workloads are best suited for different delivery models."
                    }
                },
                {
                    "id": "2907b5c8-50cb-47a7-9c9f-fcf4d6a8985e",
                    "text": "Infrastructure as a service (IaaS)",
                    "target": {
                        "id": "8655ba9f-e716-4315-86ce-afe6012ad0b6",
                        "template": "PO1",
                        "title": "Infrastructure as a service (IaaS):",
                        "body": "IaaS is a cloud infrastructure service where a virtualized environment is delivered as a service over the Internet by the provider. The infrastructure can include servers, network equipment and software."
                    }
                },
                {
                    "id": "195d8e4a-1371-47da-aa05-0928cd93a2c3",
                    "text": "Platform as a service (PaaS)",
                    "target": {
                        "id": "8ad38ba9-baad-49ba-ba60-c1ef1f5c1623",
                        "template": "PO1",
                        "title": "Platform as a service (PaaS):",
                        "body": "PaaS is a cloud platform service where the computing platform (operating system and associated services) is delivered as a service over the Internet by the provider. Cloud platform services support development, deployment, management and integration of applications."
                    }
                },
                {
                    "id": "c6841130-193d-43d5-88c2-add85d4f060a",
                    "text": "Software as a service (SaaS)",
                    "target": {
                        "id": "7a528ee3-5963-4003-888c-c903551d3640",
                        "template": "PO1",
                        "title": "Software as a service (SaaS):",
                        "body": "SaaS is a cloud application service where applications are delivered over the Internet by the provider. This means that the applications don’t have to be purchased, installed and run on the customer’s computers."
                    }
                },
                {
                    "id": "4d49c25b-bd7c-4ea5-bf1d-057ce71ef6bf",
                    "text": "Business process as a service (BPaaS)",
                    "target": {
                        "id": "dbcfe762-6dbd-4065-95e9-1ede765708b2",
                        "template": "PO1",
                        "title": "Business process as a service (BPaaS):",
                        "body": "BPaaS is a cloud platform service where a complete business process is provided as a service. This can include a wide range of functions across an enterprise, including billing, HR, payroll and advertising."
                    }
                },
                {
                    "id": "d51aadec-a964-4a4c-8895-fe5e0d5cffed",
                    "text": "Chief cloud officer (CCO)",
                    "target": {
                        "id": "e3c1f446-be8c-4251-bb85-e34dee5491ad",
                        "template": "PO1",
                        "title": "Chief cloud officer (CCO):",
                        "body": "The CCO is an officer who is responsible for planning, monitoring and evaluating the use of the cloud with a companywide perspective beyond the walls of the IT and business. As cloud computing becomes more widely used, this role will be required and recognized by many enterprises."
                    }
                },
                {
                    "id": "d8eec5ab-173f-4760-99d9-b98cd1f04b85",
                    "text": "Cloud-centric workload",
                    "target": {
                        "id": "90db918d-15bb-481e-9069-14c40eaaba2f",
                        "template": "PO1",
                        "title": "Cloud-centric workload:",
                        "body": "Created specifically for the cloud, a cloud-centric workload typically leverages cloud-based capabilities such as multitenancy and automatic, elastic scaling and workload portability. These innovative technologies and processes enable customers to start new services quickly."
                    }
                },
                {
                    "id": "f96278ff-f588-4086-87da-b01598775883",
                    "text": "Cloud-enabled workload",
                    "target": {
                        "id": "9cc26840-1cd6-4042-8f93-f1366fa28fae",
                        "template": "PO1",
                        "title": "Cloud-enabled workload:",
                        "body": "Cloud-enabled workloads are deployed with applications originally designed for precloud environments. While application architecture often dictates platform requirements, cloud adaptation assessments and optimized migration projects help cut customers’ IT resource and operating costs."
                    }
                },
                {
                    "id": "284d613e-450f-4009-896e-d3d015cf6f87",
                    "text": "DevOps on PaaS",
                    "target": {
                        "id": "1d61bfe1-2631-42ff-8389-1a118dd62ad2",
                        "template": "PO1",
                        "title": "DevOps on PaaS:",
                        "body": "Integrated tools and PaaS come together to provide the portability of workload via hybrid cloud, making agile and elastic DevOps environments possible."
                    }
                }
            ]
        }
    ]
}
},{}],17:[function(require,module,exports){
module.exports = [
  require('./0af17960-db7a-4551-a6f0-e6ed5145d9e8.json'),
  require('./95017953-cca4-4d11-acb8-13ec5d657cde.json'),
  require('./ccab7c6e-ec15-41d1-abcf-2f4a93c1ede9.json'),
  require('./e8b0be7b-eebc-4a4c-9824-a78238947eda.json'),
  require('./e9ddaad3-83c6-4662-a461-4be70d765846.json'),
  require('./fb4a9e17-6665-4d48-a964-a82c50cde47a.json')
]
},{"./0af17960-db7a-4551-a6f0-e6ed5145d9e8.json":11,"./95017953-cca4-4d11-acb8-13ec5d657cde.json":12,"./ccab7c6e-ec15-41d1-abcf-2f4a93c1ede9.json":13,"./e8b0be7b-eebc-4a4c-9824-a78238947eda.json":14,"./e9ddaad3-83c6-4662-a461-4be70d765846.json":15,"./fb4a9e17-6665-4d48-a964-a82c50cde47a.json":16}],18:[function(require,module,exports){
module.exports = {
  'cac2b27c-fa00-400d-a644-ba6408b2566d': {
    edition: require('./cac2b27c-fa00-400d-a644-ba6408b2566d.json'),
    containers: require('./cac2b27c-fa00-400d-a644-ba6408b2566d/containers')
  }
}
},{"./cac2b27c-fa00-400d-a644-ba6408b2566d.json":10,"./cac2b27c-fa00-400d-a644-ba6408b2566d/containers":17}],19:[function(require,module,exports){
module.exports = {
  editions: require('./editions/')
}
},{"./editions/":18}],20:[function(require,module,exports){
var $ = require('jQuery');
var FastClick = require('fastclick');



/**

  IBM EM UI
--------------------------------------------------------
-----------------------------------------------------  */


/*
In this app, all measurements are in rem units when possible
and relate to the HTML element.  The HTML element has a
minimum font-size of 62.5% at 768px viewport width.  The
font-size value will respond as the viewport's width
resizes. In effect, it resizes everything that uses rem units,
and since the images are set to be 100% width, the result is a
nice responsive experience where it almost appears that the site
zooms in and out, as opposed to flexing content to the viewport.
*/

function zoomBaseFontSize(){
  // 768 / 62.5 = 12.2888 this is our zoom coeficient
  var $win = $(window),
      maxWidth = 768;
      minWidth = 320,
      fontSizeAtMinWidth = 100,
      zoomCoefficient = minWidth / fontSizeAtMinWidth,
      newFontSize = $(window).width() / zoomCoefficient;
  // Zoom of larger than minWidth
  if($win.width() > minWidth && $win.width() < maxWidth + 1){
    $("html").css("font-size", newFontSize+"%");
  }
  else {
    $("html").css("font-size", fontSizeAtMinWidth+"%");
  }
  if($win.width() > maxWidth) {
    $("html").css("font-size", "100%");
  }
}
zoomBaseFontSize();


$(function(){

  // Resizing
  $(window).resize(function(){
    zoomBaseFontSize();
  });

});


$(function(){

  /* @paging
  ----------------------------------------------------- */

  // First is always active
  $(".t").eq(0).addClass("is-active");

  // Pagers
  $(".t__pager").on("click", function(){
    $(this).parent(".t").removeClass("is-active").next(".t").not(".modal").addClass("is-active");
    console.log (
      $(this).parent(".t").next(".t").not(".modal"),
      $(this).parent(".t").next(".t"),
      $(this).parent(".t")
    );
  });

  // Buttons in A2 open next modal
  $(".a2 .btn").on("click", function(){
    $(this).parents(".t").next(".modal").addClass("is-active");
  });


  // Modal close
  $(".modal__close").on("click", function(){
    $(this).parent(".modal").removeClass("is-active");
  });



  /* @fast-click
  ----------------------------------------------------- */
  FastClick.attach(document.body);





  /* @accordians
  ----------------------------------------------------- */

  $(".js-accordian-toggle").on("click", function(e){
    // prevent default event
    e.preventDefault();
    // define vars
    var toggle =  $(this),
        target = toggle.attr("data-toggle"),
        targets = $(".accordian-menu__link[data-toggle='"+target+"']");
    // toggle active classes for this and other accordian menu links
    $(".accordian-menu__link").removeClass("is-active");
    targets.addClass("is-active");

  });




  /* @toggle-nav
  ---------------------------------------------------- */

  $(".js-toggle-nav ").on("click", function(e){
    // prevent default event
    e.preventDefault();
    // toggle active nav classes for site header and main
    $(".site-header, .site-main").toggleClass("is-active-nav");
  });


  $(".site-nav__links a").on("click", function(e){
    // update active state
    $(".site-nav__links a").removeClass("is-active");
    $(this).addClass("is-active");
    // update nav title
    $(".site-nav__title").text($(this).find("b").text());
    // update nav
    $(".site-header, .site-main").toggleClass("is-active-nav");
  });


});

},{}],21:[function(require,module,exports){
var _ = require('underscore');
var Handlebars = require('handlebars');




Handlebars.registerHelper('po', function(template, context, parentContext, options){
  template = template.replace(/\//g, '_');
  var f = Handlebars.partials['pages.' + template.toLowerCase()];
  if (!f) {
    return "Partial not loaded";
  }

  context = _.extend(context, {parent: parentContext});
  return new Handlebars.SafeString(f(context));
});
},{"underscore":22}],22:[function(require,module,exports){
//     Underscore.js 1.5.1
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.1';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value == null ? _.identity : value);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var result;
    var timeout = null;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}]},{},[20,21,1,2,3,4,5,6,7,8,9])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYXBwLmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvYXBwL2JhY2tib25lL2NvbGxlY3Rpb25zL2NvbnRhaW5lcnMuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYmFja2JvbmUvbW9kZWxzL2NvbnRhaW5lci5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2FwcC9iYWNrYm9uZS9tb2RlbHMvZWRpdGlvbi5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2FwcC9iYWNrYm9uZS9yb3V0ZXJzL2FwcC5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2FwcC9iYWNrYm9uZS92aWV3cy9jb250YWluZXIuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYmFja2JvbmUvdmlld3MvbmF2LmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvYXBwL2JhY2tib25lL3ZpZXdzL3BhZ2UuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYmFja2JvbmUvdmlld3MvdGVtcGxhdGUuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9qc29uL2VkaXRpb25zL2NhYzJiMjdjLWZhMDAtNDAwZC1hNjQ0LWJhNjQwOGIyNTY2ZC5qc29uIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvanNvbi9lZGl0aW9ucy9jYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmQvY29udGFpbmVycy8wYWYxNzk2MC1kYjdhLTQ1NTEtYTZmMC1lNmVkNTE0NWQ5ZTguanNvbiIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2pzb24vZWRpdGlvbnMvY2FjMmIyN2MtZmEwMC00MDBkLWE2NDQtYmE2NDA4YjI1NjZkL2NvbnRhaW5lcnMvOTUwMTc5NTMtY2NhNC00ZDExLWFjYjgtMTNlYzVkNjU3Y2RlLmpzb24iLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9qc29uL2VkaXRpb25zL2NhYzJiMjdjLWZhMDAtNDAwZC1hNjQ0LWJhNjQwOGIyNTY2ZC9jb250YWluZXJzL2NjYWI3YzZlLWVjMTUtNDFkMS1hYmNmLTJmNGE5M2MxZWRlOS5qc29uIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvanNvbi9lZGl0aW9ucy9jYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmQvY29udGFpbmVycy9lOGIwYmU3Yi1lZWJjLTRhNGMtOTgyNC1hNzgyMzg5NDdlZGEuanNvbiIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2pzb24vZWRpdGlvbnMvY2FjMmIyN2MtZmEwMC00MDBkLWE2NDQtYmE2NDA4YjI1NjZkL2NvbnRhaW5lcnMvZTlkZGFhZDMtODNjNi00NjYyLWE0NjEtNGJlNzBkNzY1ODQ2Lmpzb24iLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9qc29uL2VkaXRpb25zL2NhYzJiMjdjLWZhMDAtNDAwZC1hNjQ0LWJhNjQwOGIyNTY2ZC9jb250YWluZXJzL2ZiNGE5ZTE3LTY2NjUtNGQ0OC1hOTY0LWE4MmM1MGNkZTQ3YS5qc29uIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvanNvbi9lZGl0aW9ucy9jYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmQvY29udGFpbmVycy9pbmRleC5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2pzb24vZWRpdGlvbnMvaW5kZXguanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9qc29uL2luZGV4LmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvbGliL2dsb2JhbC11aS5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2xpYi9oYW5kbGViYXJzX2hlbHBlcnMuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyICQgPSByZXF1aXJlKCdqUXVlcnknKTtcbnZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5CYWNrYm9uZS4kID0gJDtcblxudmFyIEFwcFJvdXRlciA9IHJlcXVpcmUoJy4vYmFja2JvbmUvcm91dGVycy9hcHAnKTtcblxucmVxdWlyZSgndGVtcGxhdGVzJykocmVxdWlyZSgnaGFuZGxlYmFycycpKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHJvdXRlciA9IG5ldyBBcHBSb3V0ZXIoKTtcblxuICAvLyBzdGFydCBsaXN0ZW5pbmcgZm9yIHBhdGggY2hhbmdlc1xuICBvcHRpb25zLnB1c2hTdGF0ZSA9IHRydWU7XG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgQmFja2JvbmUuaGlzdG9yeS5zdGFydChvcHRpb25zKTtcbiAgfSk7XG59KSgpOyIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbnZhciBDb250YWluZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvY29udGFpbmVyJyk7XG52YXIgQ29udGFpbmVycztcblxuXG5cbkNvbnRhaW5lcnMgPSBtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblxuICBtb2RlbDogQ29udGFpbmVyXG5cbn0pIiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxudmFyIENvbnRhaW5lcjtcblxuXG5cblxuQ29udGFpbmVyID0gbW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXG4gIGZldGNoOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRyaWdnZXIoJ3N5bmMnKTtcbiAgfVxuXG59KTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbnZhciBDb250YWluZXJzID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvY29udGFpbmVycycpO1xudmFyIGpzb24gPSByZXF1aXJlKCcuLi8uLi8uLi9qc29uJyk7XG52YXIgRWRpdGlvbjtcblxuXG5cblxuRWRpdGlvbiA9IG1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblxuICBkZWZhdWx0czoge1xuICAgIGlkOiAnY2FjMmIyN2MtZmEwMC00MDBkLWE2NDQtYmE2NDA4YjI1NjZkJ1xuICB9XG5cbiwgZmV0Y2g6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhID0ganNvbi5lZGl0aW9uc1t0aGlzLmdldCgnaWQnKV07XG4gICAgdmFyIGVkaXRpb24gPSBqc29uLmVkaXRpb25zW3RoaXMuZ2V0KCdpZCcpXS5lZGl0aW9uO1xuXG4gICAgdGhpcy5zZXQoZWRpdGlvbik7XG5cbiAgICB2YXIgY29udGFpbmVycyA9IF8ubWFwKGRhdGEuY29udGFpbmVycywgZnVuY3Rpb24oY29udGFpbmVyKXtcbiAgICAgIHJldHVybiBfLmV4dGVuZChjb250YWluZXIsIHtlZGl0aW9uOiBfLnBpY2soZWRpdGlvbiwgJ2lkJywgJ3RpdGxlJyl9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY29udGFpbmVycyA9IG5ldyBDb250YWluZXJzKGNvbnRhaW5lcnMpO1xuXG4gICAgdGhpcy50cmlnZ2VyKCdzeW5jJyk7XG4gIH0sXG5cbn0pIiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxudmFyIEVkaXRpb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvZWRpdGlvbicpO1xudmFyIENvbnRhaW5lciA9IHJlcXVpcmUoJy4uL21vZGVscy9jb250YWluZXInKTtcbnZhciBQYWdlVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3BhZ2UnKTtcbnZhciBBcHBSb3V0ZXI7XG5cblxuXG5cbkFwcFJvdXRlciA9IG1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG5cbiAgcm91dGVzOiB7XG4gICAgJyc6ICdpbmRleCcsXG4gICAgJ2VkaXRpb25zLzppZCc6ICdlZGl0aW9uJyxcbiAgICAnZWRpdGlvbnMvOmlkL2NvbnRhaW5lcnMvOmlkJzogJ2NvbnRhaW5lcidcbiAgfVxuXG4sIHJlbmRlclZpZXc6IGZ1bmN0aW9uKGVkaXRpb25JZCwgY29udGFpbmVySWQpIHtcbiAgICB2YXIgZWRpdGlvbiA9IChlZGl0aW9uSWQpID8gbmV3IEVkaXRpb24oe2lkOiBlZGl0aW9uSWR9KSA6IG5ldyBFZGl0aW9uKCk7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGVkaXRpb24ub24oJ3N5bmMnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfZWRpdGlvbiA9IGVkaXRpb247XG4gICAgICB2YXIgY29udGFpbmVyID0gKGNvbnRhaW5lcklkKSA/IGVkaXRpb24uY29udGFpbmVycy5maW5kV2hlcmUoe2lkOiBjb250YWluZXJJZH0pIDogZWRpdGlvbi5jb250YWluZXJzLm1vZGVsc1swXTtcbiAgICAgIHZhciBfX3RoaXMgPSBfdGhpcztcblxuICAgICAgY29udGFpbmVyLm9uKCdzeW5jJywgZnVuY3Rpb24oKXtcbiAgICAgICAgX190aGlzLm5hdmlnYXRlKCcvZWRpdGlvbnMvJyArIF9lZGl0aW9uLmlkICsgJy9jb250YWluZXJzLycgKyBjb250YWluZXIuaWQsIHtyZXBsYWNlOiB0cnVlfSk7XG4gICAgICAgIG5ldyBQYWdlVmlldyh7ZWw6ICQoJy5qcy1ib2R5JyksIGVkaXRpb246IF9lZGl0aW9uLCBjb250YWluZXI6IGNvbnRhaW5lcn0pO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnRhaW5lci5mZXRjaCgpO1xuICAgIH0pO1xuXG4gICAgZWRpdGlvbi5mZXRjaCgpO1xuICB9XG5cbiwgaW5kZXg6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVuZGVyVmlldygpXG4gIH1cblxuLCBlZGl0aW9uOiBmdW5jdGlvbihlZGl0aW9uSWQpIHtcbiAgICB0aGlzLnJlbmRlclZpZXcoZWRpdGlvbklkKTtcbiAgfVxuXG4sIGNvbnRhaW5lcjogZnVuY3Rpb24oZWRpdGlvbklkLCBjb250YWluZXJJZCkge1xuICAgIHRoaXMucmVuZGVyVmlldyhlZGl0aW9uSWQsIGNvbnRhaW5lcklkKTtcbiAgfVxuXG59KTtcbiIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxudmFyIFRlbXBsYXRlVmlldyA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKTtcbnZhciBDb250YWluZXJWaWV3O1xuXG5cblxuXG5Db250YWluZXJWaWV3ID0gbW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuLCByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgZWRpdGlvbiA9IHRoaXMubW9kZWwuZ2V0KCdlZGl0aW9uJyk7XG4gICAgdmFyIGNvbnRhaW5lciA9IF8ucGljayh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMsICdpZCcsICd0aXRsZScsICdudW1iZXInKTtcblxuICAgIF8uZWFjaCh0aGlzLm1vZGVsLmdldCgncGFnZXMnKSwgZnVuY3Rpb24ocGFnZSl7XG4gICAgICB2YXIgYXR0cmlidXRlcyA9IF8uZXh0ZW5kKHBhZ2UsIHtlZGl0aW9uOiBlZGl0aW9uLCBjb250YWluZXI6IGNvbnRhaW5lcn0pO1xuICAgICAgdmFyIG1vZGVsID0gbmV3IEJhY2tib25lLk1vZGVsKGF0dHJpYnV0ZXMpO1xuICAgICAgdmFyIHZpZXcgPSBuZXcgVGVtcGxhdGVWaWV3KHttb2RlbDogbW9kZWx9KTtcbiAgICAgIF90aGlzLiRlbC5hcHBlbmQodmlldy5yZW5kZXIoKS5lbCk7XG4gICAgfSk7XG4gIH1cblxufSkiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG52YXIgRWRpdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9lZGl0aW9uLmpzJyk7XG52YXIgTmF2VmlldztcblxuXG5cbk5hdlZpZXcgPSBtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICB0ZW1wbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEpTVC5uYXY7XG4gIH1cblxuLCBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4sIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGh0bWwgPSB0aGlzLnRlbXBsYXRlKCkodGhpcy5tb2RlbC50b0pTT04oKSk7XG4gICAgdGhpcy4kZWwuaHRtbChodG1sKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn0pIiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxudmFyIE5hdlZpZXcgPSByZXF1aXJlKCcuL25hdicpO1xudmFyIENvbnRhaW5lclZpZXcgPSByZXF1aXJlKCcuL2NvbnRhaW5lcicpO1xudmFyIFBhZ2VWaWV3O1xuXG5cblxuXG5QYWdlVmlldyA9IG1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgbmV3IE5hdlZpZXcoe2VsOiAkKCcuanMtbmF2LWNvbnRhaW5lcicpLCBtb2RlbDogb3B0aW9ucy5lZGl0aW9ufSk7XG4gICAgbmV3IENvbnRhaW5lclZpZXcoe2VsOiB0aGlzLiQoJy5qcy1tYWluJyksIG1vZGVsOiBvcHRpb25zLmNvbnRhaW5lcn0pO1xuICB9XG5cbn0pOyIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbnZhciBCYXNlVmlldztcblxuXG5cblxuQmFzZVZpZXcgPSBtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICB0ZW1wbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEpTVFsncGFnZXMuJyArIHRoaXMubW9kZWwuZ2V0KCd0ZW1wbGF0ZScpLnRvTG93ZXJDYXNlKCldO1xuICB9XG5cbiwgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaHRtbCA9IHRoaXMudGVtcGxhdGUoKSh0aGlzLm1vZGVsLnRvSlNPTigpKTtcbiAgICB0aGlzLiRlbC5odG1sKGh0bWwpO1xuICAgIHRoaXMuc2V0RWxlbWVudCh0aGlzLiQoJ3NlY3Rpb24nKSlcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn0pOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImlkXCI6IFwiY2FjMmIyN2MtZmEwMC00MDBkLWE2NDQtYmE2NDA4YjI1NjZkXCIsXG4gICAgXCJ0aXRsZVwiOiBcIlNtYXJ0ZXIgQ2xvdWRcIixcbiAgICBcImNvbnRhaW5lcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiMGFmMTc5NjAtZGI3YS00NTUxLWE2ZjAtZTZlZDUxNDVkOWU4XCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjAxXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiSWRlYXMgb24gYSBwYWdlXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImQwOThkOTM1LTQ3MGUtNDU2ZC1hZTMwLTI5NGI1NzZmMjhlMFwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIwMlwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRocmVlIGltcG9ydGFudCBzaGlmdHMgaW4gdGhlIHdvcmxkXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImU5ZGRhYWQzLTgzYzYtNDY2Mi1hNDYxLTRiZTcwZDc2NTg0NlwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIwM1wiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRocmVlIG11c3QtcmVhZHNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiOTUwMTc5NTMtY2NhNC00ZDExLWFjYjgtMTNlYzVkNjU3Y2RlXCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjA0XCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiVGhlIG5ldyB3YXkgZm9yd2FyZFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI0OWJiMTQ2Yy1mNzdlLTQzOGEtODMxMC1kMjljNDhjZmQzMmZcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCI6IFwiMDVcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGUgbmV3IG91dGNvbWVzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImU4MWNhNjdjLWU5MzItNDI4Zi1iODNlLWZjMWQ3M2NkMWYxM1wiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIwNlwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkltcG9ydGFudCBjb252ZXJzYXRpb25zIHRvIGhhdmVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiOWIyNzFlYmMtNzI5NC00N2UwLWE0YTQtZWZhMWJkOTAzZTNlXCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjA3XCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiT3Bwb3J0dW5pdGllcyBmb3IgaW5ub3ZhdGlvblwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI0NTcxM2NjZi1iZmRmLTRhNzYtYWJlOS0xMzM3ZGUzNjA4MzNcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCI6IFwiMDhcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGUgSUJNIGluZHVzdHJ5IHBlcnNwZWN0aXZlXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjhhMThhOTBlLWU1NWQtNGMxYy05NTVjLThlZjY2ZTI3ZTRhNVwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIwOVwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIldoeSBJQk0gYmVhdHMgdGhlIGNvbXBldGl0aW9uXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImZiNGE5ZTE3LTY2NjUtNGQ0OC1hOTY0LWE4MmM1MGNkZTQ3YVwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIxMFwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRoZSBuZXcgdm9jYWJ1bGFyeVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJjY2FiN2M2ZS1lYzE1LTQxZDEtYWJjZi0yZjRhOTNjMWVkZTlcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCI6IFwiMTFcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJXaHkgaW5mcmFzdHJ1Y3R1cmUgbWF0dGVyc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJlOGIwYmU3Yi1lZWJjLTRhNGMtOTgyNC1hNzgyMzg5NDdlZGFcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCI6IFwiMTJcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGUgc3lzdGVtIGNob2ljZXNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiYWIyZWVjYzYtYTUwZS00MWU5LWJhOGEtZjZjYzJlMTVkYjZlXCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjEzXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiUGFydG5lcmluZyBvcHRpb25zIHRvIGV4cGxvcmVcIlxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImlkXCI6IFwiMGFmMTc5NjAtZGI3YS00NTUxLWE2ZjAtZTZlZDUxNDVkOWU4XCIsXG4gICAgXCJudW1iZXJcIjogXCIwMVwiLFxuICAgIFwidGl0bGVcIjogXCJJZGVhcyBvbiBhIHBhZ2VcIixcbiAgICBcInBhZ2VzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjRlZGJjNzVlLTQ1NjgtNDEwYS1hOTRmLWVmMzk2ZDE1YTQ1M1wiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkkxXCIsXG4gICAgICAgICAgICBcImJvZHlcIjogXCJIb3cgeW91IHNob3VsZCBiZSB0aGlua2luZyBhYm91dCBjbG91ZCwgYW5kIHdoZXJlIHRvIHN0YXJ0XCIsXG4gICAgICAgICAgICBcImJhY2tncm91bmRcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwiaW1hZ2UuanBnXCIsXG4gICAgICAgICAgICAgICAgXCJ1cmxAMnhcIjogXCJpbWFnZUAyeC5qcGdcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiM2I2MGUzZDMtOGU2NC00MmM3LTlmY2ItNzVhOTllNDMzNDY3XCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiVDFcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJDbG91ZCBpcyBhIGJ1c2luZXNzIGdyb3d0aCBlbmdpbmUuIEJleW9uZCByZXRoaW5raW5nIElULCBpdCBpcyBhIHBhdGggZm9yIHJlaW52ZW50aW5nIGJ1c2luZXNzLlwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCIxNjE0NzQ2OC05NTllLTQ5NWYtOTJmNS00M2ZiYTVjOGExYzJcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJBMVwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkdldCBmYXN0ZXJcIixcbiAgICAgICAgICAgIFwiYm9keVwiOiBcIlRvIGRyaXZlIGlubm92YXRpb24gYW5kIG1lZXQgdGhlIGluY3JlYXNpbmcgZXhwZWN0YXRpb25zIG9mIGNvbnN1bWVycywgZW1wbG95ZWVzLCBzdXBwbGllcnMgYW5kIHBhcnRuZXJzLCBvcmdhbml6YXRpb25zIG11c3QgY29udGludW91c2x5IGFuZCBtb3JlIHF1aWNrbHkgZGV2ZWxvcCwgZGVwbG95IGFuZCBpbXByb3ZlIGFwcGxpY2F0aW9ucyBhbmQgc2VydmljZXMuXCIsXG4gICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJyXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiXCI6IFwiMFwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiaGlnaGxpZ2h0XCI6IFwiNzIlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIm9mIENFT3Mgc3VydmV5ZWQgc2VlIHRoZSBuZWVkIHRvIGltcHJvdmUgcmVzcG9uc2UgdGltZSB0byBtYXJrZXQuXFxuXFxuQmFzZWQgb24gSUJNIFB1cmVzeXN0ZW1zVE0gcmVzZWFyY2guXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJoaWdobGlnaHRcIjogXCI1OCVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwib2YgY29tcGFuaWVzIG1vdmUgdG8gdGhlIHByaXZhdGUgY2xvdWQgdG8gZ2FpbiBhZ2lsaXR5IGFuZCBzcGVlZC5cXG5cXG5GcHdlYi5uZXQsIFxcXCJ2YWx1ZSBvZiB0aGUgcHJpdmF0ZSBjbG91ZFxcXCIgaW5mb2dyYXBoaWMsIG1heSAxNCwgMjAxMy5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjBkNDBlODEzLWY5MTMtNDNiOC04ZDE3LWM4NWIyMjQ4ZjBhOVwiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkExXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiR2V0IGVtcG93ZXJlZFwiLFxuICAgICAgICAgICAgXCJib2R5XCI6IFwiSXQgaXMgdW5kZXIgcHJlc3N1cmUgdG8gcmFwaWRseSBkZWxpdmVyIGludHVpdGl2ZSwgb24tZGVtYW5kIGFjY2VzcyB0byBidXNpbmVzcyBzZXJ2aWNlcyBhY3Jvc3MgdGhlIGVudGVycHJpc2UgYW5kIHRvIHNwZWVkIGFwcGxpY2F0aW9uIGFuZCBzZXJ2aWNlIGRlcGxveW1lbnQgYnkgZW5hYmxpbmcgZGV2ZWxvcGVycyB0byBjcmVhdGUgdGhlaXIgb3duIGRldmVsb3BtZW50IGFuZCB0ZXN0IGVudmlyb25tZW50cy5cIixcbiAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJoaWdobGlnaHRcIjogXCI0NSVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwib2YgQ0ZPcyBuZWVkIGltcHJvdmVkIHRlY2hub2xvZ3kgc3VwcG9ydCBmb3IgdGhlIHF1YWxpdHkgb2YgdGhlIGRhdGEgdXNlZCBmb3IgYnVzaW5lc3MgZGVjaXNpb25zLlxcblxcbkZpbmFuY2lhbCBleGVjdXRpdmVzIGludGVybmF0aW9uYWwsIFxcXCJ0aGUgQ0ZPJ3MgdG9wIHRlY2hub2xvZ3kgaW1wZXJhdGl2ZXMsXFxcIiBKb2huIGUuIFZhbiBkZWNrZXIgYW5kIFdpbGxpYW0gbS4gU2lubmV0dCwgSnVuZSAyMDEzLlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJyXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiXCI6IFwiMFwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiaGlnaGxpZ2h0XCI6IFwiMzYlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIm9mIGJ1c2luZXNzIGxlYWRlcnMgbWFuYWdlIGNsb3VkIHNlcnZpY2VzIHdpdGhvdXQgaW52b2x2ZW1lbnQgb3Igc3VwcG9ydCBvZiBpdC5cXG5cXG5JQk0gY2VudGVyIGZvciBhcHBsaWVkIGluc2lnaHRzLCBjbG91ZCBnbG9iYWwgc3R1ZHksIDIwMTMuXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI0ZjNkMTEzZi1kMmYwLTQwNTYtYjgxMS1hODBiNzhkZTE4NTNcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJBMVwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkdldCBlZmZpY2llbnRcIixcbiAgICAgICAgICAgIFwiYm9keVwiOiBcIk9yZ2FuaXphdGlvbnMgbXVzdCBpbXByb3ZlIHRoZSBlY29ub21pY3Mgb2YgaXQsIHVzaW5nIHNlbGYtc2VydmljZSBidXNpbmVzcyBzZXJ2aWNlcyBhbmQgYXBwbGljYXRpb25zIHdpdGggYSB1c2UtYmFzZWQgcGF5bWVudCBtb2RlbCwgYWRkaW5nIG5ldyBjYXBhYmlsaXRpZXMgYW5kIGNhcGFjaXR5IGFzIG5lZWRlZCwgYW5kIG1heGltaXppbmcgdGhlIHZhbHVlIG9mIGV4aXN0aW5nIGluZnJhc3RydWN0dXJlLlwiLFxuICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjBcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImhpZ2hsaWdodFwiOiBcIjc2JVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJvZiBpdCBkZWNpc2lvbiBtYWtlcnMgYXJlIGNvbmNlcm5lZCBvciB2ZXJ5IGNvbmNlcm5lZCBieSB0aGUgcmlzaW5nIHByZXNzdXJlIHRvIHJlZHVjZSBjb3N0cy5cXG5cXG5Gb3JyZXN0ZXIgY29uc3VsdGluZywgY2hhbGxlbmdpbmcgdGhlIHN0YXR1cyBxdW8gb24gbWFpbnRlbmFuY2UgY29udHJhY3RzIGFuZCByZWZyZXNoIGN5Y2xlcyB0byBsb3dlciBjb3N0cywgbWF5IDIwMTMuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJoaWdobGlnaHRcIjogXCIzMSVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwib2YgZXhlY3V0aXZlcyBzdXJ2ZXllZCBjaXRlZCBjbG91ZCdzIGFiaWxpdHkgdG8gcmVkdWNlIGZpeGVkIGl0IGNvc3RzIGFuZCBzaGlmdCB0byBhIG1vcmUgdmFyaWFibGUgXFxcInBheSBhcyB5b3UgZ29cXFwiIGNvc3Qgc3RydWN0dXJlIGFzIGEgdG9wIGJlbmVmaXQuXFxuXFxuSUJNLCB0aGUgcG93ZXIgb2YgY2xvdWQ6IGRyaXZpbmcgYnVzaW5lc3MgbW9kZWwgaW5ub3ZhdGlvbiwgRmVicnVhcnkgMjAxMi5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJpZFwiOiBcIjk1MDE3OTUzLWNjYTQtNGQxMS1hY2I4LTEzZWM1ZDY1N2NkZVwiLFxuICAgIFwibnVtYmVyXCI6IFwiMDRcIixcbiAgICBcInRpdGxlXCI6IFwiVGhlIG5ldyB3YXkgZm9yd2FyZFwiLFxuICAgIFwicGFnZXNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiNzg5MmNhMTEtZGZkNC00ODcwLWJjNjctZTkxMmJhN2Y5ZTA2XCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiSTFcIixcbiAgICAgICAgICAgIFwiYm9keVwiOiBcIldoYXQgSUJNIGFuZCBvdXIgY2xpZW50cyBjYW4gYWNoaWV2ZSB0b2dldGhlci1sYWlkIG91dCBpbiBhIGNvbW1vbiBmcmFtZVwiLFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiBcImltYWdlLmpwZ1wiLFxuICAgICAgICAgICAgICAgIFwidXJsQDJ4XCI6IFwiaW1hZ2VAMnguanBnXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjU4NWI0NjlkLTc5ZDUtNDQ4MS04NmNjLWFiZTYxNzcyMTA5M1wiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIk00XCIsXG4gICAgICAgICAgICBcImdyYXBoaWNcIjogXCJpbWFnZS5zdmdcIixcbiAgICAgICAgICAgIFwibGlua3NcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjI1NVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiXCI6IFwiMjU1XCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUmVpbnZlbnQgcmVzdGxlc3NseVwiLFxuICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uLnN2Z1wiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiMTE2N2ViZjQtMzk3MC00YzYxLWE2YWYtMWMzMWY4OGNjMGU1XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiQTNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiXCI6IFwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJSZWludmVudCByZXN0bGVzc2x5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1YnRpdGxlXCI6IFwiSW5ub3ZhdGUgbW9yZSB0aGFuIHByb2R1Y3RzIGFuZCBzZXJ2aWNlcy1pbm5vdmF0ZSB0byByZWludmVudCB5b3VyIGJ1c2luZXNzLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiV2hhdCBpdCBtZWFuc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJUaGUgaW5mbHVlbmNlIG9mIGNsb3VkIHBlcm1lYXRlcyBvcmdhbml6YXRpb25hbCBjdWx0dXJlcywgZHJpdmluZyBhIHJhZGljYWwgcmV0aGlua2luZyBvZiBob3cgYnVzaW5lc3MgbGVhZGVycyBhcHByb2FjaCB0aGVpciByb2xlcyBhbmQsIHVsdGltYXRlbHksIGhvdyB3b3JrIGdldHMgZG9uZS4gQ2xvdWQgY2FuIHNwZWVkIGFjY2VzcyB0byB0cnVzdGVkIGluZm9ybWF0aW9uIGFuZCBpbnNpZ2h0cywgZWFzZSBjb2xsYWJvcmF0aW9uLCBhbmQgZW5hYmxlIHRoZSByZWxlbnRsZXNzIHB1cnN1aXQgb2YgYmV0dGVyIGJ1c2luZXNzIG91dGNvbWVzLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJXaG8gQmVuZWZpdHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiQy1zdWl0ZVxcblByb2R1Y3QgbWFuYWdlbWVudFxcbkVudGVycHJpc2UgYXJjaGl0ZWN0c1xcbkFwcGxpY2F0aW9uIGRldmVsb3BlcnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJ1dHRvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlF1ZXN0aW9ucyB0byB0aGluayBhYm91dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjliM2JkODgxLWQ1ZTQtNDI5Ny1iMzA4LWZhYjMxMGQzNjNlZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE83XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVlc3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJcyB5b3VyIG9yZ2FuaXphdGlvbmFsIGN1bHR1cmUgb3BlbiB0byByZWludmVudGlvbj9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJIb3cgZG9lcyB5b3VyIGluZnJhc3RydWN0dXJlIGVuYWJsZSBhZ2lsaXR5IHRvIHN1cHBvcnQgcmFwaWQgY2hhbmdlcyB0byBwcm9jZXNzZXMgYW5kIHN5c3RlbXM/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG93IGhhcyB5b3VyIHNlbmlvciBsZWFkZXJzaGlwIGRlbW9uc3RyYXRlZCBjb21taXRtZW50IHRvIGNvbnRpbnVvdXMgdG9wLWRvd24gYW5kIGJvdHRvbS11cCBpbm5vdmF0aW9uP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgZGVncmVlIG9mIGV4cGVydGlzZSBhbmQgYWN1bWVuIGRvZXMgeW91ciB3b3JrZm9yY2UgaGF2ZSB0byBpbWFnaW5lIGFuZCBpbXBsZW1lbnQgY2hhbmdlP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvdyBtaWdodCBjbG91ZCB0ZWNobm9sb2dpZXMgY2hhbmdlIHRoZSB3YXkgeW91IHdvcmsgd2l0aCBwYXJ0bmVycyBhbmQgc3VwcGxpZXJzP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjI1NVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiXCI6IFwiMjU1XCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRW1wb3dlciB0aHJvdWdoIGluc2lnaHRzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb24uc3ZnXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI4MTRiNTUyYi0wNWM3LTRmMTYtYWM1ZC0wMGVhMjUyOGYyNzlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJBM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkVtcG93ZXIgdGhyb3VnaCBpbnNpZ2h0c1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdWJ0aXRsZVwiOiBcIkRlZXBlbiBrbm93bGVkZ2Ugb2YgY3VzdG9tZXJzLCBwYXJ0bmVycywgc3VwcGxpZXJzIGFuZCBwcm9jZXNzZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIldoYXQgaXQgbWVhbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiQXMgbmV3IHRlY2hub2xvZ2llcyBjcmVhdGUgbmV3IHR5cGVzIGFuZCBzb3VyY2VzIG9mIGRhdGEsIGxlYWRlcnMgYXJlIHVzaW5nIGFuYWx5dGljcyB0byBpbmZvcm0gYW5kIGVtcG93ZXIgd29ya2VycyB0byBzZWl6ZSBlbWVyZ2luZyBvcHBvcnR1bml0aWVzLiBUaHJvdWdoIGNsb3VkLWJhc2VkIGFuYWx5dGljcywgYnVzaW5lc3MgdXNlcnMgY2FuIGRlZXBlbiB0aGVpciB1bmRlcnN0YW5kaW5nIG9mIGN1c3RvbWVycywgY29tcGV0aXRvcnMgYW5kIHRoZSBjb21wbGV0ZSB2YWx1ZSBjaGFpbi5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiV2hvIEJlbmVmaXRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlNhbGVzXFxuQ3VzdG9tZXIgc2VydmljZVxcblByb2N1cmVtZW50XFxuU3VwcGx5IGNoYWluXFxuTWVyY2hhbmRpc2luZ1xcbkh1bWFuIHJlc291cmNlc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYnV0dG9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiUXVlc3Rpb25zIHRvIHRoaW5rIGFib3V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiMGNjMDk5NzUtODkzMS00Y2Y1LWJlZTQtYWU4MDg4OGNkZWExXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJxdWVzdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgaGF2ZSB5b3UgZG9uZSB0byBlbmFibGUgeW91ciBvcmdhbml6YXRpb24gdG8gZGVsaXZlciBzZXJ2aWNlcyB0aGF0IGFudGljaXBhdGUgY3VzdG9tZXIgbmVlZHM/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBpbnNpZ2h0cyBkbyB5b3Uga25vdyBhcmUgb3V0IHRoZXJlIGluIHRoZSBkYXRhLCBpZiBvbmx5IHlvdSBjb3VsZCBicmluZyB0b2dldGhlciBhbmQgYW5hbHl6ZSB0aGUgcmlnaHQgZGF0YT9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IGNvdWxkIHlvdXIgb3JnYW5pemF0aW9uIGRvIGRpZmZlcmVudGx5IGlmIGJ1c2luZXNzIHVzZXJzIGhhZCBzZWxmLXNlcnZpY2UgYWNjZXNzIHRvIGFuYWx5dGljcyBhcHBsaWNhdGlvbnMgaW4gdGhlIGNsb3VkP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgc3RlcHMgaGFzIHlvdXIgb3JnYW5pemF0aW9uIHRha2VuIHRvIGludGVncmF0ZSBpdHMgYW5hbHl0aWNzIGFuZCBjbG91ZCBzdHJhdGVnaWVzP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgYXJlIHlvdSBkb2luZyB0byBlbmFibGUgeW91ciBvcmdhbml6YXRpb24gdG8gYW50aWNpcGF0ZSBjdXN0b21lciBuZWVkcz9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJyXCI6IFwiMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjI1NVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk9yY2hlc3RyYXRlIGR5bmFtaWMgY2xvdWRzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb24uc3ZnXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCIxYTU1NDg3Yi1kZDNhLTQzNzctOThmYy0xZmRjZmE0ZDYzMzhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJBM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk9yY2hlc3RyYXRlIGR5bmFtaWMgY2xvdWRzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1YnRpdGxlXCI6IFwiSW1wcm92ZSBidXNpbmVzcyBwcm9jZXNzZXMgYW5kIHNlY3VyaXR5LCBhbmQgZW5oYW5jZSBhZ2lsaXR5IGFuZCByZXNwb25zaXZlbmVzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiV2hhdCBpdCBtZWFuc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJBcyByZXF1aXJlbWVudHMgY2hhbmdlLCBvcHBvcnR1bml0aWVzIGFyZSBpZGVudGlmaWVkIG9yIHRocmVhdHMgYXJpc2UsIGl0IG11c3QgYmUgcmVhZHkuIEluIHRoZSBjb21wZXRpdGl2ZSBtYXJrZXRwbGFjZSwgYWR2YW50YWdlIHdpbGwgZ28gdG8gdGhvc2Ugd2hvIGNhbiBhZGFwdCBpbnN0YW50bHktZHluYW1pY2FsbHkgY29uc3VtaW5nIGFuZCBkZWxpdmVyaW5nIGNyaXRpY2FsIGNhcGFiaWxpdGllcyB0aHJvdWdoIHRoZSByaWdodCBjb21iaW5hdGlvbiBvZiBwdWJsaWMsIHByaXZhdGUgYW5kIGh5YnJpZCBjbG91ZHMuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIldobyBCZW5lZml0c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJQcm9jdXJlbWVudFxcblN1cHBseSBjaGFpblxcbk1lcmNoYW5kaXNpbmdcXG5NYXJrZXRpbmdcXG5JdFxcbkh1bWFuIHJlc291cmNlc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYnV0dG9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiUXVlc3Rpb25zIHRvIHRoaW5rIGFib3V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiYjNiYjljZjQtYWUxNi00M2Q2LWE5Y2UtNjFiYzlkMjU4YTU5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJxdWVzdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgYXJlIHlvdSBub3QgYWJsZSB0byBkZWxpdmVyIHRocm91Z2ggdGhlIGNsb3VkP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvdyBmYXIgYWxvbmcgYXJlIHlvdSBpbiB1c2luZyBhIHZhcmlldHkgb2YgY2xvdWQgbW9kZWxzLXB1YmxpYywgcHJpdmF0ZSBhbmQgaHlicmlkP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvdyBkbyB5b3UgZGV0ZXJtaW5lIHdoZXJlIHRvIHJ1biBhIGdpdmVuIHByb2Nlc3Mgb3IgYXBwbGljYXRpb24gZnJvbSBhIGJ1c2luZXNzIGFuZCB0ZWNobm9sb2d5IHBlcnNwZWN0aXZlP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIldoaWNoIGNsb3VkLWJhc2VkIGJ1c2luZXNzIHNvbHV0aW9ucyBhbmQgc2VydmljZXMgYXJlIHlvdSBjdXJyZW50bHkgdXNpbmc/IFdoeSB0aG9zZT9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IGFwcGVhbHMgdG8geW91IG1vc3QgYWJvdXQgY2xvdWQgc2VydmljZXM/IFdoYXQgY29uY2VybnMgZG8geW91IGhhdmU/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJpZFwiOiBcImNjYWI3YzZlLWVjMTUtNDFkMS1hYmNmLTJmNGE5M2MxZWRlOVwiLFxuICAgIFwibnVtYmVyXCI6IFwiMTFcIixcbiAgICBcInRpdGxlXCI6IFwiV2h5IGluZnJhc3RydWN0dXJlIG1hdHRlcnNcIixcbiAgICBcInBhZ2VzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjQ5ODBiNGQwLTdlYWYtNDYxMC05ODkwLWU5MjI4M2E1NDRmZlwiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkkxXCIsXG4gICAgICAgICAgICBcImJvZHlcIjogXCJFeHBsb3JpbmcgdGhlIGludGVyc2VjdGlvbiBvZiBidXNpbmVzcyBvdXRjb21lcyBhbmQgaW5mcmFzdHJ1Y3R1cmUgc3RyYXRlZ2llc1wiLFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiBcImltYWdlLmpwZ1wiLFxuICAgICAgICAgICAgICAgIFwidXJsQDJ4XCI6IFwiaW1hZ2VAMnguanBnXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjVjYzdhOWU3LWNmN2YtNGU5Zi1hNGU4LTI2MzRlNmQ5YThmMVwiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlQyXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiSXQgbWF0dGVycyBiZWNhdXNlIGJ1c2luZXNzIG91dGNvbWVzIG1hdHRlciBhbmQgbmV3IG91dGNvbWVzIGVudGFpbCBuZXcgZGVtYW5kcy5cIixcbiAgICAgICAgICAgIFwiYm9keVwiOiBcIlxcXCJBIHdpZGUgcmFuZ2Ugb2YgaW5ub3ZhdGlvbnMgaXMgaGFwcGVuaW5nIGF0IHRoZSBpbmZyYXN0cnVjdHVyZSBsYXllciwgYXMgY29udGludWVkIGhhcmR3YXJlIGltcHJvdmVtZW50cyBkcml2ZSBuZXcgY2FwYWJpbGl0aWVzIGZvciBjb21wdXRlLCBzdG9yYWdlLCBhbmQgbmV0d29ya2luZyBhbmQgY29tYmluZSB3aXRoIG5ldyBpbm5vdmF0aW9ucyBpbiBzb2Z0d2FyZS4gVGhlc2Ugd2lsbCByZWNvbWJpbmUgaW4gbnVtZXJvdXMgd2F5cyB0byBjcmVhdGUgbXVjaCBtb3JlIGNhcGFibGUgaW5mcmFzdHJ1Y3R1cmUgYW5kIGFwcGxpY2F0aW9uIHBsYXRmb3Jtc1xcXCJcXG5cXG4tYnJpYW4gaG9wa2lucyBldCBhbC4sIGZvcnJlc3RlciByZXNlYXJjaCwgZmVicnVhcnkgMjAxM1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJiZWZiNDI1YS1lMWRiLTRjYmQtODQyNS03NmEwOWUzZTA5ZTNcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJBM1wiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIldpbWJsZWRvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzdWJ0aXRsZVwiOiBcIkEgcHJlbWllciB0ZW5uaXMgZXZlbnQgbmVlZGVkIHRvIGRlbGl2ZXIgaW5ub3ZhdGl2ZSB3YXlzIHRvIHNoYXJlIHRoZSBleGNpdGVtZW50IG9mIHRoZSB0b3VybmFtZW50IGFuZCBlbmdhZ2UgbWlsbGlvbnMgb2YgZmFucyBnbG9iYWxseS4gQSB3ZWJzaXRlIHRoYXQgbGV2ZXJhZ2VkIGNsb3VkIHdpdGggc29jaWFsIGFuZCBtb2JpbGUgY2FwYWJpbGl0aWVzIHdhcyB0aGUgYW5zd2VyLlwiLFxuICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiV2h5IHRoaXMgY2xpZW50IHRvb2sgYWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlNvY2lhbCBhbmQgbW9iaWxlIHRyZW5kcyBoYXZlIGRyaXZlbiBuZXcgY3VzdG9tZXIgZXhwZXJpZW5jZSBleHBlY3RhdGlvbnMsIHBhcnRpY3VsYXJseSBhdCBzcG9ydGluZyBldmVudHMuIEZhaWx1cmUgdG8gZGVsaXZlciBhIHNlYW1sZXNzIGludGVyYWN0aXZlIGV4cGVyaWVuY2UgY2FuIGxlYWQgdG8gbG93ZXIgc2F0aXNmYWN0aW9uIGFuZCBsb3NzIG9mIHBvdGVudGlhbCByZXZlbnVlLlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJCdXNpbmVzcyBvdXRjb21lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkZvciB0d28gd2Vla3MgZXZlcnkgeWVhciwgMTcgbWlsbGlvbiB2aXNpdG9ycyBlbmpveSBhbiBpbm5vdmF0aXZlLCBpbnRlcmFjdGl2ZSB3ZWIgZXhwZXJpZW5jZSB0aGF0IHNhdGlzZmllcyBhbiBpbmNyZWFzaW5nbHkgc29waGlzdGljYXRlZCBmYW4gYmFzZS5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiUmVxdWlyZW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkluIDIwMTIsIDQwIHBlcmNlbnQgb2Ygd2Vic2l0ZSB2aXNpdHMgd2VyZSB2aWEgbW9iaWxlIGRldmljZXMsIGFuZCBkb3dubG9hZHMgb2YgYSBtb2JpbGUgYXBwIGRvdWJsZWQgb3ZlciB0aGUgcHJldmlvdXMgeWVhci4gTW9iaWxlIGRlbWFuZHMgYWRkZWQgcHJlc3N1cmUgdG8gdGhlIGluZnJhc3RydWN0dXJlLCByZXF1aXJpbmcgY29udGludW91cyBhdmFpbGFiaWxpdHkgYW5kIHNlY3VyaXR5LCB3aGlsZSBjb3N0LXBlci1zaXRlLXZpc2l0IGZpZ3VyZXMgbmVlZGVkIHRvIGdvIGRvd24uXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJidXR0b25cIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiNTQyNGJiOWItYzkyNy00ZmIxLWFlMDYtZTU0Njk1N2NiZGZjXCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiQTNcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjoge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJiXCI6IFwiMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInRleHRcIjogXCJTb3V0aCBhbWVyaWNhbiBmaW5hbmNpYWwgb3JnYW5pemF0aW9uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInN1YnRpdGxlXCI6IFwiQSBmaW5hbmNpYWwgaW5zdGl0dXRpb24ncyBncm93dGggd2FzIGJlaW5nIGhpbmRlcmVkIGJ5IGl0cyBpbmFiaWxpdHkgdG8gcXVpY2tseSBkZWxpdmVyIGFuZCBsYXVuY2ggbmV3IGNsaWVudCBzZXJ2aWNlcyBpbiBhIGNvbXBldGl0aXZlIG1hcmtldHBsYWNlLiBJdCBuZWVkZWQgYSBzY2FsYWJsZSBpbmZyYXN0cnVjdHVyZSB0aGF0IGl0IGNvdWxkIGVhc2lseSBhbmQgcmFwaWRseSBwcm92aXNpb24gdG8gZGVsaXZlciBuZXcgc2VydmljZXMsIHN1Y2ggYXMgbW9iaWxlIGJhbmtpbmcgYXBwcyBhbmQgd2ViLWJhc2VkIHNlbGYtc2VydmljZXMuXCIsXG4gICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJXaHkgdGhpcyBjbGllbnQgdG9vayBhY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiQW4gaW5lZmZpY2llbnQgYnVzaW5lc3MgcGxhdGZvcm0gY2FuJ3QgbWVldCB0aGUgZXhwZWN0YXRpb25zIG9mIG5ldyBjdXN0b21lcnMgbG9va2luZyB0byBiYW5rIHdoZW4sIHdoZXJlIGFuZCBob3cgdGhleSB3YW50LCBzbyBuZWl0aGVyIGJhbmtpbmcgcmV2ZW51ZXMgbm9yIHByb2ZpdHMgZ3Jvdy5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiQnVzaW5lc3Mgb3V0Y29tZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJUaHJvdWdoIGNsb3VkIHNlcnZpY2VzIGFuZCBvdGhlciB0ZWNobm9sb2dpZXMsIHRoZSBmaW5hbmNpYWwgb3JnYW5pemF0aW9uIHN1cHBvcnRlZCBhIDYwMCBwZXJjZW50IGdyb3d0aCByYXRlIGluIG1vYmlsZSB0cmFuc2FjdGlvbnMgYW5kIGEgMjAwIHBlcmNlbnQgdXBzdXJnZSBpbiB3ZWIgdHJhbnNhY3Rpb25zIHdoaWxlIHNhdmluZyB1c2QxLjUgbWlsbGlvbiBpbiBvcGVyYXRpb25hbCBjb3N0cy5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiUmVxdWlyZW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlRvIGNyZWF0ZSBuZXcgc2VydmljZXMgcXVpY2tseSwgc2VydmVycyBuZWVkZWQgdG8gYmUgcHJvdmlzaW9uZWQgaW4gc2Vjb25kcywgYW5kIHRoZSBpbmZyYXN0cnVjdHVyZSBuZWVkZWQgdG8gc2NhbGUgcmFwaWRseS4gVGhlIGNsaWVudCBhbHNvIGhhZCB0byByZWR1Y2UgYWRtaW5pc3RyYXRpdmUgZWZmb3J0LCBpbXByb3ZlIG1hbmFnZWFiaWxpdHksIGxvd2VyIHNvZnR3YXJlIG1haW50ZW5hbmNlIGV4cGVuc2VzIGFuZCBzaWduaWZpY2FudGx5IHJlZHVjZSBlbmVyZ3kuXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJidXR0b25cIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiYmZmMWU5MjEtNzA5ZC00N2QwLWFhYzYtMzQwYWRhNmVjZDRmXCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiQTNcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjoge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJiXCI6IFwiMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDb21wdXRlciBzZXJ2aWNlcyBjb21wYW55XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInN1YnRpdGxlXCI6IFwiQSBldXJvcGVhbiBjb21wdXRlciBzZXJ2aWNlcyBjb21wYW55IG5lZWRlZCBhIGNsb3VkIHN0b3JhZ2Ugc2VydmljZSB0aGF0IGNvdWxkIGhlbHAgZGlmZmVyZW50aWF0ZSBpdCBpbiB0aGUgbWFya2V0cGxhY2UgYW5kIGFkZCB2YWx1ZSB0byBpdHMgcG9ydGZvbGlvLiBUaGUgYnVzaW5lc3MgbmVlZGVkIGEgbG93LWNvc3QsIHNjYWxhYmxlIGluZnJhc3RydWN0dXJlIHRvIHN1cHBvcnQgdGhpcyB2YWx1YWJsZSBuZXcgb2ZmZXJpbmcgYW5kIGVuYWJsZSBjdXN0b21lcnMgdG8gc2hhcmUgYW5kIHN5bmNocm9uaXplIGRhdGEgaW4gYSBzZWN1cmUgYW5kIGNvbnZlbmllbnQgd2F5LlwiLFxuICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiV2h5IHRoaXMgY2xpZW50IHRvb2sgYWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlNlbGYtc2VydmljZSBjYXBhYmlsaXRpZXMgaGluZ2Ugb24gYSByZXNwb25zaXZlIGluZnJhc3RydWN0dXJlOyBzbG93IHBlcmZvcm1hbmNlIGNhbiBuZWdhdGl2ZWx5IGFmZmVjdCB0aGUgdXNlciBleHBlcmllbmNlIGFuZCBjdXN0b21lciBzYXRpc2ZhY3Rpb24uXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkJ1c2luZXNzIG91dGNvbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiSW4gbGVzcyB0aGFuIHR3byBtb250aHMsIHRoZSBjb21wYW55IGxhdW5jaGVkIGFuIGlubm92YXRpdmUgY2xvdWQgc3RvcmFnZSBzZXJ2aWNlIHdpdGggZmFyIGxvd2VyICBlbmVyZ3kgY29zdHMgcGVyIHBldGFieXRlIHRoYW4gdGhleSBoYWQgYWNoaWV2ZWQgcHJldmlvdXNseS5cXG5cXG5DdXN0b21lcnMgY2FuIHVzZSBzZWxmLXNlcnZpY2UgY2FwYWJpbGl0aWVzIHRvIHByb3Zpc2lvbiBzdG9yYWdlIHNlcnZlcnMgaW4ganVzdCAzMCBzZWNvbmRzIGFuZCBhY2Nlc3MgZmlsZXMgaW4gb25seSAxNSBzZWNvbmRzLlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJSZXF1aXJlbWVudHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiVGhlc2UgY2FwYWJpbGl0aWVzIHJlcXVpcmUgYSBzY2FsYWJsZSwgc2VjdXJpdHktcmljaCBpbmZyYXN0cnVjdHVyZSB0aGF0IGlzIGVhc3kgYW5kIGNvc3QtZWZmZWN0aXZlIHRvIG1hbmFnZSBhbmQgdGhhdCBzdXBwb3J0cyBncmFudWxhciBiaWxsaW5nLlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiYnV0dG9uXCI6IG51bGxcbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJpZFwiOiBcImU4YjBiZTdiLWVlYmMtNGE0Yy05ODI0LWE3ODIzODk0N2VkYVwiLFxuICAgIFwibnVtYmVyXCI6IFwiMTJcIixcbiAgICBcInRpdGxlXCI6IFwiVGhlIHN5c3RlbSBjaG9pY2VzXCIsXG4gICAgXCJwYWdlc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI2NTRlYmY3Yi02YjJhLTQzNDQtYjVkZS03YjAwOTI4MWEyMDFcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJJMVwiLFxuICAgICAgICAgICAgXCJib2R5XCI6IFwiRXhwbG9yZSBob3cgaWJtIGRlbGl2ZXJzIGtleSBpbmZyYXN0cnVjdHVyZSBjaGFyYWN0ZXJpc3RpY3MgYW5kIGNyZWF0ZXMgbmV3IHZhbHVlLlwiLFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiBcImltYWdlLmpwZ1wiLFxuICAgICAgICAgICAgICAgIFwidXJsQDJ4XCI6IFwiaW1hZ2VAMnguanBnXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjY2MDEyMTgxLTEwYWMtNGIxOS05NWJhLWNiMTViYjNhZGIwZFwiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIk0zXCIsXG4gICAgICAgICAgICBcImJvZHlcIjogXCJUb2RheSdzIGluZHVzdHJ5IGxlYWRlcnMgbmVlZCB0byBiZSBhcm1lZCB3aXRoIHRoZSByaWdodCBpbmZyYXN0cnVjdHVyZSB0byBhZGRyZXNzIHRoZSBldmVyLWNoYW5naW5nIG5lZWRzIGFuZCBleHBlY3RhdGlvbnMgb2YgdGhlaXIgY3VzdG9tZXJzIGFuZCBvcmdhbml6YXRpb25zLiBUbyBjbGFpbSBsZWFkZXJzaGlwLCB0aGVpciBpdCBzeXN0ZW1zIG5lZWQgdG8gZGVtb25zdHJhdGUgdGhlIHJpZ2h0IGNoYXJhY3RlcmlzdGljcy4gRXhwbG9yZSBob3cgaWJtIGNhbiBoZWxwLlwiLFxuICAgICAgICAgICAgXCJidXR0b25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJSZXNpbGllbmN5IG1hdHRlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImU2YWMwYWJiLTFkYzgtNGRiZS1hNzE0LTdlNDFmNTViZDc5YlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlJlc2lsaWVuY3kgbWF0dGVyc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiQSBkeW5hbWljLCByZXNwb25zaXZlLCBzZWN1cml0eS1yaWNoIGluZnJhc3RydWN0dXJlIHRoYXQgcmFwaWRseSBzY2FsZXMgdXAgYW5kIGRvd25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkhvdyBpYm0gZGVsaXZlcnMgb24gcmVzaWxpZW5jeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJBZHZhbmNlZCBtZW1vcnkgdXRpbGl6YXRpb24gYW5kIGNhY2hpbmcgb2ZmZXIgbmVhci1saW5lYXIgc2NhbGFiaWxpdHkgKHNjYWxlIHVwIHRvIDEwMCwwMDAgdmlydHVhbCBtYWNoaW5lcyBvbiBhIHNpbmdsZSBzeXN0ZW0pLiBSZXNvdXJjZSBtYW5hZ2VtZW50IGFjcm9zcyBwaHlzaWNhbCBhbmQgdmlydHVhbCBpbmZyYXN0cnVjdHVyZXMgY2FuIHNjYWxlIGluIGFjY29yZGFuY2Ugd2l0aCBidXNpbmVzcyBuZWVkcy4gUm9idXN0IHNlY3VyaXR5IGdvdmVybmFuY2UgdG9vbHMgYW5kIGF1ZGl0IHByb2Nlc3NlcyBoZWxwIHJlZHVjZSByaXNrLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGUgdmFsdWUgdG8gdGhlIGNpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJBIHJpY2gsIGludGVyYWN0aXZlIGV4cGVyaWVuY2UgY2FuIGluY3JlYXNlIHJldmVudWUgYW5kIHVzZXIgc2F0aXNmYWN0aW9uLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJFZmZpY2llbmN5IG1hdHRlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjg3ZjkxZThhLWMwM2EtNDM1MC04NDg5LTBlMWZkZDU0YjExYlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkVmZmljaWVuY3kgbWF0dGVyc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiRWZmZWN0aXZlIHV0aWxpemF0aW9uIG9mIGl0IGluZnJhc3RydWN0dXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJIb3cgaWJtIGRlbGl2ZXJzIG9uIGVmZmljaWVuY3lcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiSW50ZWdyYXRlZCBtYW5hZ2VtZW50IGFuZCBhdXRvbWF0aW9uIGhlbHAgc2ltcGxpZnkgaXQgbWFuYWdlbWVudCwgcmVkdWNlIGFkbWluaXN0cmF0aXZlIHRpbWUgYW5kIGltcHJvdmUgZWZmaWNpZW5jeSB3aGlsZSByZWR1Y2luZyBjb3N0cy4gUmVwZWF0YWJsZSwgcHJvdmVuIHBhdHRlcm5zIG9mIGV4cGVydGlzZSBjYW4gbW9yZSBxdWlja2x5IGJ1aWxkIGlubm92YXRpdmUgc29sdXRpb25zIHdpdGggbG9naWNhbCByZXByZXNlbnRhdGlvbnMgb2YgcmVjdXJyaW5nIHRvcG9sb2dpZXMgZm9yIGdpdmVuIHJlcXVpcmVtZW50cy5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVGhlIHZhbHVlIHRvIHRoZSBjaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiTmV3IGNsaWVudCBzZXJ2aWNlcyBhcmUgcmFwaWRseSBkZXZlbG9wZWQsIHdoaWxlIG9wZXJhdGlvbmFsIGNvc3RzIGRlY3JlYXNlLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJSZXNwb25zaXZlbmVzcyBtYXR0ZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI2M2EzNjBiNy05NWZiLTRmYmMtYjA1MS03YzVmNDkzYmY1NjZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJSZXNwb25zaXZlbmVzcyBtYXR0ZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJBbiBpbnRlZ3JhdGVkLCBtb2R1bGFyIGluZnJhc3RydWN0dXJlIHRoYXQgaXMgcmFwaWRseSBkZXBsb3lhYmxlIGFuZCBoaWdobHkgc2NhbGFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkhvdyBpYm0gZGVsaXZlcnMgb24gcmVzcG9uc2l2ZW5lc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiQSBkZWVwbHkgaW50ZWdyYXRlZCBjb21wdXRpbmcsIHN0b3JhZ2UgYW5kIG5ldHdvcmtpbmcgc3lzdGVtIGNhbiByYXBpZGx5IGRlcGxveSBjbG91ZCBzZXJ2aWNlcyBpbiBtaW51dGVzIGluc3RlYWQgb2YgZGF5cy4gQW4gaW50ZWdyYXRlZCBzZXQgb2YgY2FwYWJpbGl0aWVzIGhlbHBzIGJ1aWxkIHNlY3VyaXR5LXJpY2ggcHJpdmF0ZSBjbG91ZHMgYW5kIGNsb3VkIGRlbGl2ZXJ5IHBsYXRmb3JtcyBmb3IgbWFuYWdlZCBzZXJ2aWNlIHByb3ZpZGVycy5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVGhlIHZhbHVlIHRvIHRoZSBjaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiQSBjb3N0LWNvbXBldGl0aXZlLCBoaWdobHkgcmVzcG9uc2l2ZSBzb2x1dGlvbiBpcyBxdWlja2x5IGJyb3VnaHQgdG8gdGhlIG1hcmtldHBsYWNlLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImlkXCI6IFwiZTlkZGFhZDMtODNjNi00NjYyLWE0NjEtNGJlNzBkNzY1ODQ2XCIsXG4gICAgXCJudW1iZXJcIjogXCIwM1wiLFxuICAgIFwidGl0bGVcIjogXCJUaHJlZSBtdXN0LXJlYWRzXCIsXG4gICAgXCJwYWdlc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCIxZjcxNmY5MC0wNWM5LTQ2ZjAtOWY2MC1kZDZiN2FiMzRjYzlcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJJMVwiLFxuICAgICAgICAgICAgXCJib2R5XCI6IFwiQSBwb3dlcmZ1bCB3YXkgdG8gaW5jcmVhc2UgdGhlIGNvbGxlY3RpdmUgZXhwZXJ0aXNlXCIsXG4gICAgICAgICAgICBcImJhY2tncm91bmRcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwiaW1hZ2UuanBnXCIsXG4gICAgICAgICAgICAgICAgXCJ1cmxAMnhcIjogXCJpbWFnZUAyeC5qcGdcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiN2JiMjViOGItZmNlZS00OGY5LTkxYjEtYWQxMjBjMjk0ZDBjXCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiTTZcIixcbiAgICAgICAgICAgIFwibGlua3NcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImZiMjRhM2ExLWZkNTAtNDZkMy05ZWUxLTYwODU2OWZjZmE4MFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJUaGUgcG93ZXIgb2YgY2xvdWQ6IERyaXZpbmcgYnVzaW5lc3MgbW9kZWwgaW5ub3ZhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiY2RkOTVjYTQtYThiOC00YTI1LTg0MjctOTE2NzVhNGFkYzk5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE82XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVGhlIHBvd2VyIG9mIGNsb3VkOiBEcml2aW5nIGJ1c2luZXNzIG1vZGVsIGlubm92YXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlRoZSBJQk0gSW5zdGl0dXRlIGZvciBCdXNpbmVzcyBWYWx1ZSwgdGhyb3VnaCBhIHN1cnZleSBjb25kdWN0ZWQgaW4gY29uanVuY3Rpb24gd2l0aCB0aGUgRWNvbm9taXN0IEludGVsbGlnZW5jZSBVbml0LCBkaXNjb3ZlcnMgaG93IGdsb2JhbCBidXNpbmVzcyBhbmQgdGVjaG5vbG9neSBleGVjdXRpdmVzIHNlZSB0aGUgZ2FtZS1jaGFuZ2luZyBwb3RlbnRpYWwgb2YgY2xvdWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIklCTSBJbnN0aXR1dGUgZm9yIEJ1c2luZXNzIFZhbHVlIGV4ZWN1dGl2ZSByZXBvcnQsIEZlYnJ1YXJ5IDIwMTJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiBcImh0dHA6Ly93d3ctOTM1LmlibS5jb20vc2VydmljZXMvdXMvZ2JzL3Rob3VnaHRsZWFkZXJzaGlwL2lidi1wb3dlci1vZi1jbG91ZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiZDI0ZDZjYjgtZmVhZC00ODRiLWIyYWMtMmM5YWVkODMyYzdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlxcXCJIb3cgQ2xvdWQgQ29tcHV0aW5nIElzIENoYW5naW5nIElUIE9yZ2FuaXphdGlvbnNcXFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCIzYmE1Zjc5ZS05MmYwLTQ2ZDItOWFhMy03NDcyMjNiYTY5MzJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJcXFwiSG93IENsb3VkIENvbXB1dGluZyBJcyBDaGFuZ2luZyBJVCBPcmdhbml6YXRpb25zXFxcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiSW4gaW52ZXN0aWdhdGluZyB0aGUgZWZmZWN0IG9mIGNsb3VkIG9uIGNvcnBvcmF0ZSBJVCBkZXBhcnRtZW50cywgRGVsb2l0dGUgSW5zaWdodHMgZm91bmQgYSBtYWpvciBzaGlmdCBpbiB0aGUgcmVzcG9uc2liaWxpdGllcyBvZiBJVCBwcm9mZXNzaW9uYWxzLCBpbmNsdWRpbmcgdGhlIGFiaWxpdHkgdG8gZm9jdXMgb24gaGlnaC12YWx1ZSBhY3Rpdml0aWVzIHRoYXQgZW5hYmxlIG5ldyBpbnNpZ2h0cyBhbmQgaW5ub3ZhdGlvbi5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ0lPIEpvdXJuYWwg4oCTIERlbG9pdHRlIEluc2lnaHRzLCBBcHJpbCAyOSwgMjAxM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IFwiaHR0cDovL2RlbG9pdHRlLndzai5jb20vY2lvLzIwMTMvMDQvMjkvaG93LWNsb3VkLWNvbXB1dGluZy1pcy1jaGFuZ2luZy1pdC1vcmdhbml6YXRpb25zL1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjZjYzk1N2U3LTJlMGYtNDNiZS1hNGE2LWRiZGUyYjU3N2U0OFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJFbWJyYWNlIHRoZSBJbmV2aXRhYmxlOiBTaXggSW1wZXJhdGl2ZXMgdG8gUHJlcGFyZSBZb3VyIENvbXBhbnkgZm9yIENsb3VkIENvbXB1dGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiZTM3OWZjZjEtNjMxMS00ZDEyLWI0YmMtODdkMzlkZjg0ZGNhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE82XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiRW1icmFjZSB0aGUgSW5ldml0YWJsZTogU2l4IEltcGVyYXRpdmVzIHRvIFByZXBhcmUgWW91ciBDb21wYW55IGZvciBDbG91ZCBDb21wdXRpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkluIHJldmlld2luZyBjbG91ZCBhZG9wdGlvbiBhdCA0NiBsZWFkaW5nIGNvbXBhbmllcywgdGhlIE1JVCBDZW50ZXIgZm9yIEluZm9ybWF0aW9uIFN5c3RlbXMgUmVzZWFyY2ggKENJU1IpIGV4cGxvcmVzIHRoZSBzaXggY3JpdGljYWwgZmFjdG9ycyB5b3VyIGNvbXBhbnkgbmVlZHMgdG8gaW1wbGVtZW50IHRvIG1heGltaXplIHRoZSBiZW5lZml0cyBvZiBjbG91ZCBjb21wdXRpbmcuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk1JVCBTbG9hbiBNYW5hZ2VtZW50IENJU1IgcmVzZWFyY2ggYnJpZWZpbmcsIE9jdG9iZXIgMTgsIDIwMTJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiBcImh0dHA6Ly9jaXNyLm1pdC5lZHUvYmxvZy9kb2N1bWVudHMvMjAxMi8xMC8xOC8yMDEyXzEwMDFfZW1icmFjZWluZXZpdGFibGVfbW9vbmV5cm9zc3BoaXBwcy1wZGYvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJpZFwiOiBcImZiNGE5ZTE3LTY2NjUtNGQ0OC1hOTY0LWE4MmM1MGNkZTQ3YVwiLFxuICAgIFwibnVtYmVyXCI6IFwiMTBcIixcbiAgICBcInRpdGxlXCI6IFwiVGhlIG5ldyB2b2NhYnVsYXJ5XCIsXG4gICAgXCJwYWdlc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI3MjZhMzY3OS1kYWU4LTQ0N2ItYmYwMi05MTk0MTE0ZjdjMTBcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJJMVwiLFxuICAgICAgICAgICAgXCJib2R5XCI6IFwiTWFzdGVyIHRoZSB0ZXJtaW5vbG9neSBzbyB5b3UgY2FuIGZyYW1lIHRoZSBjb252ZXJzYXRpb24uXCIsXG4gICAgICAgICAgICBcImJhY2tncm91bmRcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwiaW1hZ2UuanBnXCIsXG4gICAgICAgICAgICAgICAgXCJ1cmxAMnhcIjogXCJpbWFnZUAyeC5qcGdcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiYjk4NjYwZmMtMWY3NC00NWQwLTkxNmItNGQ2NDc3Mjk5MjgyXCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiTTdcIixcbiAgICAgICAgICAgIFwibGlua3NcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImFkNmEyYTkwLTM5YjItNDQ0NS05MzE3LWM4ZjBlMmQ5Mjk2MlwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDbG91ZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiOWEwOTIxZTUtMjdjMC00Y2E4LWJlM2UtNzBkMjdiZWYyZDNhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiQ2xvdWQ6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJDbG91ZCBjb21wdXRpbmcgaXMgYSBtb2RlbCBmb3IgZW5hYmxpbmcgdWJpcXVpdG91cywgY29udmVuaWVudCBuZXR3b3JrIGFjY2VzcyBvbiBkZW1hbmQgdG8gYSBzaGFyZWQgcG9vbCBvZiBjb25maWd1cmFibGUgY29tcHV0aW5nIHJlc291cmNlcy4gQ2xvdWQgdGVjaG5vbG9neSBjYW4gYmUgcmFwaWRseSBwcm92aXNpb25lZCBhbmQgcmVsZWFzZWQgd2l0aCBtaW5pbWFsIG1hbmFnZW1lbnQgZWZmb3J0IG9yIHNlcnZpY2UgcHJvdmlkZXIgaW50ZXJhY3Rpb24uXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiZjIxYjI5ZmItMDU2Mi00OTM1LWFhMmQtYzc5MjM3NDEyYmNlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlByaXZhdGUgY2xvdWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjM4ZjFhYjczLTgzNTUtNDUwOS04NDdmLTA5ZGM0YTgzNTM2NVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlByaXZhdGUgY2xvdWQ6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJBIHByaXZhdGUgY2xvdWQgaXMgb2ZmZXJlZCBvdmVyIHRoZSBJbnRlcm5ldCBvciBvdmVyIGEgcHJpdmF0ZSBpbnRlcm5hbCBuZXR3b3JrIHRvIHNlbGVjdCB1c2VyczsgaXQgaXMgbm90IGF2YWlsYWJsZSB0byB0aGUgZ2VuZXJhbCBwdWJsaWMuIFRoaXMgcHJvdmlkZXMgZ3JlYXRlciBjaG9pY2UgYW5kIGNvbnRyb2wgZm9yIGVudGVycHJpc2VzLCBlc3BlY2lhbGx5IGZvciBzdXBwb3J0aW5nIG1pc3Npb24tY3JpdGljYWwgYXBwbGljYXRpb25zLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImJiMjFlYzE1LTlmZGMtNDg2Yy1iNWFhLTY2OGUwM2Y5N2NmOVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQdWJsaWMgY2xvdWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjg1MWM5OWI0LTFhOGMtNDFhYi1iMWE4LTljZmFiOTI2MWEzMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlB1YmxpYyBjbG91ZDpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlB1YmxpYyBjbG91ZCBpcyBvZmZlcmVkIG92ZXIgdGhlIHB1YmxpYyBJbnRlcm5ldCBhbmQgYXZhaWxhYmxlIHRvIGFueW9uZSB3aG8gd2FudHMgdG8gcHVyY2hhc2UgdGhlIHNlcnZpY2UuIEl0IGlzIGNoYXJhY3Rlcml6ZWQgYnkgcmFwaWQgcHJvdmlzaW9uaW5nLCBwYXktYXMteW91LWdvIHByaWNpbmcsIGFuZCBoaWdoIGxldmVscyBvZiBzY2FsYWJpbGl0eSBhbmQgZmxleGliaWxpdHkuXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiN2IyYWQ0NmYtNjMwNy00NDEzLWFkZjYtYTc4ZWFlZTFjOGQ3XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkh5YnJpZCBjbG91ZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiNDQ3NDViNmQtYWY5YS00YzQyLThhYjktMzM3ZmJhZDliNmI0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiSHlicmlkIGNsb3VkOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiSHlicmlkIGNsb3VkIHJlcHJlc2VudHMgYSBjb21iaW5hdGlvbiBvZiBtdWx0aXBsZSBkZWxpdmVyeSBtb2RlbHMsIHBvdGVudGlhbGx5IGluY2x1ZGluZyBwdWJsaWMgY2xvdWQsIHByaXZhdGUgY2xvdWQgYW5kIHRyYWRpdGlvbmFsIG9uLXByZW1pc2VzIG1vZGVscy4gSXQgaXMgb25lIG9mIHRoZSBtb3N0IGNvbW1vbiBjbG91ZCBtb2RlbHMgZm9yIG1vc3QgZW50ZXJwcmlzZXMgYmVjYXVzZSB0aGVpciBkaWZmZXJlbnQgd29ya2xvYWRzIGFyZSBiZXN0IHN1aXRlZCBmb3IgZGlmZmVyZW50IGRlbGl2ZXJ5IG1vZGVscy5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCIyOTA3YjVjOC01MGNiLTQ3YTctOWM5Zi1mY2Y0ZDZhODk4NWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSW5mcmFzdHJ1Y3R1cmUgYXMgYSBzZXJ2aWNlIChJYWFTKVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiODY1NWJhOWYtZTcxNi00MzE1LTg2Y2UtYWZlNjAxMmFkMGI2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiSW5mcmFzdHJ1Y3R1cmUgYXMgYSBzZXJ2aWNlIChJYWFTKTpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIklhYVMgaXMgYSBjbG91ZCBpbmZyYXN0cnVjdHVyZSBzZXJ2aWNlIHdoZXJlIGEgdmlydHVhbGl6ZWQgZW52aXJvbm1lbnQgaXMgZGVsaXZlcmVkIGFzIGEgc2VydmljZSBvdmVyIHRoZSBJbnRlcm5ldCBieSB0aGUgcHJvdmlkZXIuIFRoZSBpbmZyYXN0cnVjdHVyZSBjYW4gaW5jbHVkZSBzZXJ2ZXJzLCBuZXR3b3JrIGVxdWlwbWVudCBhbmQgc29mdHdhcmUuXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiMTk1ZDhlNGEtMTM3MS00N2RhLWFhMDUtMDkyOGNkOTNhMmMzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlBsYXRmb3JtIGFzIGEgc2VydmljZSAoUGFhUylcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjhhZDM4YmE5LWJhYWQtNDliYS1iYTYwLWMxZWYxZjVjMTYyM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlBsYXRmb3JtIGFzIGEgc2VydmljZSAoUGFhUyk6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJQYWFTIGlzIGEgY2xvdWQgcGxhdGZvcm0gc2VydmljZSB3aGVyZSB0aGUgY29tcHV0aW5nIHBsYXRmb3JtIChvcGVyYXRpbmcgc3lzdGVtIGFuZCBhc3NvY2lhdGVkIHNlcnZpY2VzKSBpcyBkZWxpdmVyZWQgYXMgYSBzZXJ2aWNlIG92ZXIgdGhlIEludGVybmV0IGJ5IHRoZSBwcm92aWRlci4gQ2xvdWQgcGxhdGZvcm0gc2VydmljZXMgc3VwcG9ydCBkZXZlbG9wbWVudCwgZGVwbG95bWVudCwgbWFuYWdlbWVudCBhbmQgaW50ZWdyYXRpb24gb2YgYXBwbGljYXRpb25zLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImM2ODQxMTMwLTE5M2QtNDNkNS04OGMyLWFkZDg1ZDRmMDYwYVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJTb2Z0d2FyZSBhcyBhIHNlcnZpY2UgKFNhYVMpXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI3YTUyOGVlMy01OTYzLTQwMDMtODg4Yy1jOTAzNTUxZDM2NDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJTb2Z0d2FyZSBhcyBhIHNlcnZpY2UgKFNhYVMpOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiU2FhUyBpcyBhIGNsb3VkIGFwcGxpY2F0aW9uIHNlcnZpY2Ugd2hlcmUgYXBwbGljYXRpb25zIGFyZSBkZWxpdmVyZWQgb3ZlciB0aGUgSW50ZXJuZXQgYnkgdGhlIHByb3ZpZGVyLiBUaGlzIG1lYW5zIHRoYXQgdGhlIGFwcGxpY2F0aW9ucyBkb27igJl0IGhhdmUgdG8gYmUgcHVyY2hhc2VkLCBpbnN0YWxsZWQgYW5kIHJ1biBvbiB0aGUgY3VzdG9tZXLigJlzIGNvbXB1dGVycy5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI0ZDQ5YzI1Yi1iZDdjLTRlYTUtYmYxZC0wNTdjZTcxZWY2YmZcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQnVzaW5lc3MgcHJvY2VzcyBhcyBhIHNlcnZpY2UgKEJQYWFTKVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiZGJjZmU3NjItNmRiZC00MDY1LTk1ZTktMWVkZTc2NTcwOGIyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiQnVzaW5lc3MgcHJvY2VzcyBhcyBhIHNlcnZpY2UgKEJQYWFTKTpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkJQYWFTIGlzIGEgY2xvdWQgcGxhdGZvcm0gc2VydmljZSB3aGVyZSBhIGNvbXBsZXRlIGJ1c2luZXNzIHByb2Nlc3MgaXMgcHJvdmlkZWQgYXMgYSBzZXJ2aWNlLiBUaGlzIGNhbiBpbmNsdWRlIGEgd2lkZSByYW5nZSBvZiBmdW5jdGlvbnMgYWNyb3NzIGFuIGVudGVycHJpc2UsIGluY2x1ZGluZyBiaWxsaW5nLCBIUiwgcGF5cm9sbCBhbmQgYWR2ZXJ0aXNpbmcuXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiZDUxYWFkZWMtYTk2NC00YTRjLTg4OTUtZmU1ZTBkNWNmZmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNoaWVmIGNsb3VkIG9mZmljZXIgKENDTylcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImUzYzFmNDQ2LWJlOGMtNDI1MS1iYjg1LWUzNGRlZTU0OTFhZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkNoaWVmIGNsb3VkIG9mZmljZXIgKENDTyk6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJUaGUgQ0NPIGlzIGFuIG9mZmljZXIgd2hvIGlzIHJlc3BvbnNpYmxlIGZvciBwbGFubmluZywgbW9uaXRvcmluZyBhbmQgZXZhbHVhdGluZyB0aGUgdXNlIG9mIHRoZSBjbG91ZCB3aXRoIGEgY29tcGFueXdpZGUgcGVyc3BlY3RpdmUgYmV5b25kIHRoZSB3YWxscyBvZiB0aGUgSVQgYW5kIGJ1c2luZXNzLiBBcyBjbG91ZCBjb21wdXRpbmcgYmVjb21lcyBtb3JlIHdpZGVseSB1c2VkLCB0aGlzIHJvbGUgd2lsbCBiZSByZXF1aXJlZCBhbmQgcmVjb2duaXplZCBieSBtYW55IGVudGVycHJpc2VzLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImQ4ZWVjNWFiLTE3M2YtNDc2MC05OWQ5LWI5OGNkMWYwNGI4NVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDbG91ZC1jZW50cmljIHdvcmtsb2FkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI5MGRiOTE4ZC0xNWJiLTQ4MWUtOTA2OS0xNGM0MGVhYWJhMmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJDbG91ZC1jZW50cmljIHdvcmtsb2FkOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiQ3JlYXRlZCBzcGVjaWZpY2FsbHkgZm9yIHRoZSBjbG91ZCwgYSBjbG91ZC1jZW50cmljIHdvcmtsb2FkIHR5cGljYWxseSBsZXZlcmFnZXMgY2xvdWQtYmFzZWQgY2FwYWJpbGl0aWVzIHN1Y2ggYXMgbXVsdGl0ZW5hbmN5IGFuZCBhdXRvbWF0aWMsIGVsYXN0aWMgc2NhbGluZyBhbmQgd29ya2xvYWQgcG9ydGFiaWxpdHkuIFRoZXNlIGlubm92YXRpdmUgdGVjaG5vbG9naWVzIGFuZCBwcm9jZXNzZXMgZW5hYmxlIGN1c3RvbWVycyB0byBzdGFydCBuZXcgc2VydmljZXMgcXVpY2tseS5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJmOTYyNzhmZi1mNTg4LTQwODYtODdkYS1iMDE1OTg3NzU4ODNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ2xvdWQtZW5hYmxlZCB3b3JrbG9hZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiOWNjMjY4NDAtMWNkNi00MDQyLThmOTMtZjEzNjZmYTI4ZmFlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiQ2xvdWQtZW5hYmxlZCB3b3JrbG9hZDpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkNsb3VkLWVuYWJsZWQgd29ya2xvYWRzIGFyZSBkZXBsb3llZCB3aXRoIGFwcGxpY2F0aW9ucyBvcmlnaW5hbGx5IGRlc2lnbmVkIGZvciBwcmVjbG91ZCBlbnZpcm9ubWVudHMuIFdoaWxlIGFwcGxpY2F0aW9uIGFyY2hpdGVjdHVyZSBvZnRlbiBkaWN0YXRlcyBwbGF0Zm9ybSByZXF1aXJlbWVudHMsIGNsb3VkIGFkYXB0YXRpb24gYXNzZXNzbWVudHMgYW5kIG9wdGltaXplZCBtaWdyYXRpb24gcHJvamVjdHMgaGVscCBjdXQgY3VzdG9tZXJz4oCZIElUIHJlc291cmNlIGFuZCBvcGVyYXRpbmcgY29zdHMuXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiMjg0ZDYxM2UtNDUwZi00MDA5LTg5NmUtZDNkMDE1Y2Y2Zjg3XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkRldk9wcyBvbiBQYWFTXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCIxZDYxYmZlMS0yNjMxLTQyZmYtODM4OS0xYTExOGRkNjJhZDJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJEZXZPcHMgb24gUGFhUzpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkludGVncmF0ZWQgdG9vbHMgYW5kIFBhYVMgY29tZSB0b2dldGhlciB0byBwcm92aWRlIHRoZSBwb3J0YWJpbGl0eSBvZiB3b3JrbG9hZCB2aWEgaHlicmlkIGNsb3VkLCBtYWtpbmcgYWdpbGUgYW5kIGVsYXN0aWMgRGV2T3BzIGVudmlyb25tZW50cyBwb3NzaWJsZS5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzID0gW1xuICByZXF1aXJlKCcuLzBhZjE3OTYwLWRiN2EtNDU1MS1hNmYwLWU2ZWQ1MTQ1ZDllOC5qc29uJyksXG4gIHJlcXVpcmUoJy4vOTUwMTc5NTMtY2NhNC00ZDExLWFjYjgtMTNlYzVkNjU3Y2RlLmpzb24nKSxcbiAgcmVxdWlyZSgnLi9jY2FiN2M2ZS1lYzE1LTQxZDEtYWJjZi0yZjRhOTNjMWVkZTkuanNvbicpLFxuICByZXF1aXJlKCcuL2U4YjBiZTdiLWVlYmMtNGE0Yy05ODI0LWE3ODIzODk0N2VkYS5qc29uJyksXG4gIHJlcXVpcmUoJy4vZTlkZGFhZDMtODNjNi00NjYyLWE0NjEtNGJlNzBkNzY1ODQ2Lmpzb24nKSxcbiAgcmVxdWlyZSgnLi9mYjRhOWUxNy02NjY1LTRkNDgtYTk2NC1hODJjNTBjZGU0N2EuanNvbicpXG5dIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICdjYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmQnOiB7XG4gICAgZWRpdGlvbjogcmVxdWlyZSgnLi9jYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmQuanNvbicpLFxuICAgIGNvbnRhaW5lcnM6IHJlcXVpcmUoJy4vY2FjMmIyN2MtZmEwMC00MDBkLWE2NDQtYmE2NDA4YjI1NjZkL2NvbnRhaW5lcnMnKVxuICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVkaXRpb25zOiByZXF1aXJlKCcuL2VkaXRpb25zLycpXG59IiwidmFyICQgPSByZXF1aXJlKCdqUXVlcnknKTtcbnZhciBGYXN0Q2xpY2sgPSByZXF1aXJlKCdmYXN0Y2xpY2snKTtcblxuXG5cbi8qKlxuXG4gIElCTSBFTSBVSVxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAqL1xuXG5cbi8qXG5JbiB0aGlzIGFwcCwgYWxsIG1lYXN1cmVtZW50cyBhcmUgaW4gcmVtIHVuaXRzIHdoZW4gcG9zc2libGVcbmFuZCByZWxhdGUgdG8gdGhlIEhUTUwgZWxlbWVudC4gIFRoZSBIVE1MIGVsZW1lbnQgaGFzIGFcbm1pbmltdW0gZm9udC1zaXplIG9mIDYyLjUlIGF0IDc2OHB4IHZpZXdwb3J0IHdpZHRoLiAgVGhlXG5mb250LXNpemUgdmFsdWUgd2lsbCByZXNwb25kIGFzIHRoZSB2aWV3cG9ydCdzIHdpZHRoXG5yZXNpemVzLiBJbiBlZmZlY3QsIGl0IHJlc2l6ZXMgZXZlcnl0aGluZyB0aGF0IHVzZXMgcmVtIHVuaXRzLFxuYW5kIHNpbmNlIHRoZSBpbWFnZXMgYXJlIHNldCB0byBiZSAxMDAlIHdpZHRoLCB0aGUgcmVzdWx0IGlzIGFcbm5pY2UgcmVzcG9uc2l2ZSBleHBlcmllbmNlIHdoZXJlIGl0IGFsbW9zdCBhcHBlYXJzIHRoYXQgdGhlIHNpdGVcbnpvb21zIGluIGFuZCBvdXQsIGFzIG9wcG9zZWQgdG8gZmxleGluZyBjb250ZW50IHRvIHRoZSB2aWV3cG9ydC5cbiovXG5cbmZ1bmN0aW9uIHpvb21CYXNlRm9udFNpemUoKXtcbiAgLy8gNzY4IC8gNjIuNSA9IDEyLjI4ODggdGhpcyBpcyBvdXIgem9vbSBjb2VmaWNpZW50XG4gIHZhciAkd2luID0gJCh3aW5kb3cpLFxuICAgICAgbWF4V2lkdGggPSA3Njg7XG4gICAgICBtaW5XaWR0aCA9IDMyMCxcbiAgICAgIGZvbnRTaXplQXRNaW5XaWR0aCA9IDEwMCxcbiAgICAgIHpvb21Db2VmZmljaWVudCA9IG1pbldpZHRoIC8gZm9udFNpemVBdE1pbldpZHRoLFxuICAgICAgbmV3Rm9udFNpemUgPSAkKHdpbmRvdykud2lkdGgoKSAvIHpvb21Db2VmZmljaWVudDtcbiAgLy8gWm9vbSBvZiBsYXJnZXIgdGhhbiBtaW5XaWR0aFxuICBpZigkd2luLndpZHRoKCkgPiBtaW5XaWR0aCAmJiAkd2luLndpZHRoKCkgPCBtYXhXaWR0aCArIDEpe1xuICAgICQoXCJodG1sXCIpLmNzcyhcImZvbnQtc2l6ZVwiLCBuZXdGb250U2l6ZStcIiVcIik7XG4gIH1cbiAgZWxzZSB7XG4gICAgJChcImh0bWxcIikuY3NzKFwiZm9udC1zaXplXCIsIGZvbnRTaXplQXRNaW5XaWR0aCtcIiVcIik7XG4gIH1cbiAgaWYoJHdpbi53aWR0aCgpID4gbWF4V2lkdGgpIHtcbiAgICAkKFwiaHRtbFwiKS5jc3MoXCJmb250LXNpemVcIiwgXCIxMDAlXCIpO1xuICB9XG59XG56b29tQmFzZUZvbnRTaXplKCk7XG5cblxuJChmdW5jdGlvbigpe1xuXG4gIC8vIFJlc2l6aW5nXG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXtcbiAgICB6b29tQmFzZUZvbnRTaXplKCk7XG4gIH0pO1xuXG59KTtcblxuXG4kKGZ1bmN0aW9uKCl7XG5cbiAgLyogQHBhZ2luZ1xuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gIC8vIEZpcnN0IGlzIGFsd2F5cyBhY3RpdmVcbiAgJChcIi50XCIpLmVxKDApLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuXG4gIC8vIFBhZ2Vyc1xuICAkKFwiLnRfX3BhZ2VyXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAkKHRoaXMpLnBhcmVudChcIi50XCIpLnJlbW92ZUNsYXNzKFwiaXMtYWN0aXZlXCIpLm5leHQoXCIudFwiKS5ub3QoXCIubW9kYWxcIikuYWRkQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgY29uc29sZS5sb2cgKFxuICAgICAgJCh0aGlzKS5wYXJlbnQoXCIudFwiKS5uZXh0KFwiLnRcIikubm90KFwiLm1vZGFsXCIpLFxuICAgICAgJCh0aGlzKS5wYXJlbnQoXCIudFwiKS5uZXh0KFwiLnRcIiksXG4gICAgICAkKHRoaXMpLnBhcmVudChcIi50XCIpXG4gICAgKTtcbiAgfSk7XG5cbiAgLy8gQnV0dG9ucyBpbiBBMiBvcGVuIG5leHQgbW9kYWxcbiAgJChcIi5hMiAuYnRuXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAkKHRoaXMpLnBhcmVudHMoXCIudFwiKS5uZXh0KFwiLm1vZGFsXCIpLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuICB9KTtcblxuXG4gIC8vIE1vZGFsIGNsb3NlXG4gICQoXCIubW9kYWxfX2Nsb3NlXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAkKHRoaXMpLnBhcmVudChcIi5tb2RhbFwiKS5yZW1vdmVDbGFzcyhcImlzLWFjdGl2ZVwiKTtcbiAgfSk7XG5cblxuXG4gIC8qIEBmYXN0LWNsaWNrXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gIEZhc3RDbGljay5hdHRhY2goZG9jdW1lbnQuYm9keSk7XG5cblxuXG5cblxuICAvKiBAYWNjb3JkaWFuc1xuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICQoXCIuanMtYWNjb3JkaWFuLXRvZ2dsZVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuICAgIC8vIHByZXZlbnQgZGVmYXVsdCBldmVudFxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAvLyBkZWZpbmUgdmFyc1xuICAgIHZhciB0b2dnbGUgPSAgJCh0aGlzKSxcbiAgICAgICAgdGFyZ2V0ID0gdG9nZ2xlLmF0dHIoXCJkYXRhLXRvZ2dsZVwiKSxcbiAgICAgICAgdGFyZ2V0cyA9ICQoXCIuYWNjb3JkaWFuLW1lbnVfX2xpbmtbZGF0YS10b2dnbGU9J1wiK3RhcmdldCtcIiddXCIpO1xuICAgIC8vIHRvZ2dsZSBhY3RpdmUgY2xhc3NlcyBmb3IgdGhpcyBhbmQgb3RoZXIgYWNjb3JkaWFuIG1lbnUgbGlua3NcbiAgICAkKFwiLmFjY29yZGlhbi1tZW51X19saW5rXCIpLnJlbW92ZUNsYXNzKFwiaXMtYWN0aXZlXCIpO1xuICAgIHRhcmdldHMuYWRkQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG5cbiAgfSk7XG5cblxuXG5cbiAgLyogQHRvZ2dsZS1uYXZcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICQoXCIuanMtdG9nZ2xlLW5hdiBcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcbiAgICAvLyBwcmV2ZW50IGRlZmF1bHQgZXZlbnRcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy8gdG9nZ2xlIGFjdGl2ZSBuYXYgY2xhc3NlcyBmb3Igc2l0ZSBoZWFkZXIgYW5kIG1haW5cbiAgICAkKFwiLnNpdGUtaGVhZGVyLCAuc2l0ZS1tYWluXCIpLnRvZ2dsZUNsYXNzKFwiaXMtYWN0aXZlLW5hdlwiKTtcbiAgfSk7XG5cblxuICAkKFwiLnNpdGUtbmF2X19saW5rcyBhXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG4gICAgLy8gdXBkYXRlIGFjdGl2ZSBzdGF0ZVxuICAgICQoXCIuc2l0ZS1uYXZfX2xpbmtzIGFcIikucmVtb3ZlQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgJCh0aGlzKS5hZGRDbGFzcyhcImlzLWFjdGl2ZVwiKTtcbiAgICAvLyB1cGRhdGUgbmF2IHRpdGxlXG4gICAgJChcIi5zaXRlLW5hdl9fdGl0bGVcIikudGV4dCgkKHRoaXMpLmZpbmQoXCJiXCIpLnRleHQoKSk7XG4gICAgLy8gdXBkYXRlIG5hdlxuICAgICQoXCIuc2l0ZS1oZWFkZXIsIC5zaXRlLW1haW5cIikudG9nZ2xlQ2xhc3MoXCJpcy1hY3RpdmUtbmF2XCIpO1xuICB9KTtcblxuXG59KTtcbiIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYW5kbGViYXJzJyk7XG5cblxuXG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3BvJywgZnVuY3Rpb24odGVtcGxhdGUsIGNvbnRleHQsIHBhcmVudENvbnRleHQsIG9wdGlvbnMpe1xuICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoL1xcLy9nLCAnXycpO1xuICB2YXIgZiA9IEhhbmRsZWJhcnMucGFydGlhbHNbJ3BhZ2VzLicgKyB0ZW1wbGF0ZS50b0xvd2VyQ2FzZSgpXTtcbiAgaWYgKCFmKSB7XG4gICAgcmV0dXJuIFwiUGFydGlhbCBub3QgbG9hZGVkXCI7XG4gIH1cblxuICBjb250ZXh0ID0gXy5leHRlbmQoY29udGV4dCwge3BhcmVudDogcGFyZW50Q29udGV4dH0pO1xuICByZXR1cm4gbmV3IEhhbmRsZWJhcnMuU2FmZVN0cmluZyhmKGNvbnRleHQpKTtcbn0pOyIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuNS4xXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIEVzdGFibGlzaCB0aGUgb2JqZWN0IHRoYXQgZ2V0cyByZXR1cm5lZCB0byBicmVhayBvdXQgb2YgYSBsb29wIGl0ZXJhdGlvbi5cbiAgdmFyIGJyZWFrZXIgPSB7fTtcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgY29uY2F0ICAgICAgICAgICA9IEFycmF5UHJvdG8uY29uY2F0LFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVGb3JFYWNoICAgICAgPSBBcnJheVByb3RvLmZvckVhY2gsXG4gICAgbmF0aXZlTWFwICAgICAgICAgID0gQXJyYXlQcm90by5tYXAsXG4gICAgbmF0aXZlUmVkdWNlICAgICAgID0gQXJyYXlQcm90by5yZWR1Y2UsXG4gICAgbmF0aXZlUmVkdWNlUmlnaHQgID0gQXJyYXlQcm90by5yZWR1Y2VSaWdodCxcbiAgICBuYXRpdmVGaWx0ZXIgICAgICAgPSBBcnJheVByb3RvLmZpbHRlcixcbiAgICBuYXRpdmVFdmVyeSAgICAgICAgPSBBcnJheVByb3RvLmV2ZXJ5LFxuICAgIG5hdGl2ZVNvbWUgICAgICAgICA9IEFycmF5UHJvdG8uc29tZSxcbiAgICBuYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG4gICAgbmF0aXZlTGFzdEluZGV4T2YgID0gQXJyYXlQcm90by5sYXN0SW5kZXhPZixcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kO1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdCB2aWEgYSBzdHJpbmcgaWRlbnRpZmllcixcbiAgLy8gZm9yIENsb3N1cmUgQ29tcGlsZXIgXCJhZHZhbmNlZFwiIG1vZGUuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuNS4xJztcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIG9iamVjdHMgd2l0aCB0aGUgYnVpbHQtaW4gYGZvckVhY2hgLCBhcnJheXMsIGFuZCByYXcgb2JqZWN0cy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZvckVhY2hgIGlmIGF2YWlsYWJsZS5cbiAgdmFyIGVhY2ggPSBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm47XG4gICAgaWYgKG5hdGl2ZUZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IG5hdGl2ZUZvckVhY2gpIHtcbiAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKF8uaGFzKG9iaiwga2V5KSkge1xuICAgICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXldLCBrZXksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdG9yIHRvIGVhY2ggZWxlbWVudC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYG1hcGAgaWYgYXZhaWxhYmxlLlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZU1hcCAmJiBvYmoubWFwID09PSBuYXRpdmVNYXApIHJldHVybiBvYmoubWFwKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXN1bHRzLnB1c2goaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICB2YXIgcmVkdWNlRXJyb3IgPSAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZSc7XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlYCBpZiBhdmFpbGFibGUuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlICYmIG9iai5yZWR1Y2UgPT09IG5hdGl2ZVJlZHVjZSkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZShpdGVyYXRvciwgbWVtbykgOiBvYmoucmVkdWNlKGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSB2YWx1ZTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaW5pdGlhbCkgdGhyb3cgbmV3IFR5cGVFcnJvcihyZWR1Y2VFcnJvcik7XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VSaWdodGAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZVJpZ2h0ICYmIG9iai5yZWR1Y2VSaWdodCA9PT0gbmF0aXZlUmVkdWNlUmlnaHQpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvciwgbWVtbykgOiBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gb2JqLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoICE9PSArbGVuZ3RoKSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGluZGV4ID0ga2V5cyA/IGtleXNbLS1sZW5ndGhdIDogLS1sZW5ndGg7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IG9ialtpbmRleF07XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgb2JqW2luZGV4XSwgaW5kZXgsIGxpc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaW5pdGlhbCkgdGhyb3cgbmV3IFR5cGVFcnJvcihyZWR1Y2VFcnJvcik7XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZmlsdGVyYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVGaWx0ZXIgJiYgb2JqLmZpbHRlciA9PT0gbmF0aXZlRmlsdGVyKSByZXR1cm4gb2JqLmZpbHRlcihpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiAhaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgIH0sIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZXZlcnlgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yIHx8IChpdGVyYXRvciA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlRXZlcnkgJiYgb2JqLmV2ZXJ5ID09PSBuYXRpdmVFdmVyeSkgcmV0dXJuIG9iai5ldmVyeShpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKCEocmVzdWx0ID0gcmVzdWx0ICYmIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHNvbWVgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgdmFyIGFueSA9IF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yIHx8IChpdGVyYXRvciA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZVNvbWUgJiYgb2JqLnNvbWUgPT09IG5hdGl2ZVNvbWUpIHJldHVybiBvYmouc29tZShpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHJlc3VsdCB8fCAocmVzdWx0ID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gdmFsdWUgKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIHRhcmdldCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIG9iai5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSByZXR1cm4gb2JqLmluZGV4T2YodGFyZ2V0KSAhPSAtMTtcbiAgICByZXR1cm4gYW55KG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdGFyZ2V0O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF0pLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBtYXBgOiBmZXRjaGluZyBhIHByb3BlcnR5LlxuICBfLnBsdWNrID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSl7IHJldHVybiB2YWx1ZVtrZXldOyB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzLCBmaXJzdCkge1xuICAgIGlmIChfLmlzRW1wdHkoYXR0cnMpKSByZXR1cm4gZmlyc3QgPyB2b2lkIDAgOiBbXTtcbiAgICByZXR1cm4gX1tmaXJzdCA/ICdmaW5kJyA6ICdmaWx0ZXInXShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHJzW2tleV0gIT09IHZhbHVlW2tleV0pIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8ud2hlcmUob2JqLCBhdHRycywgdHJ1ZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgb3IgKGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICAvLyBDYW4ndCBvcHRpbWl6ZSBhcnJheXMgb2YgaW50ZWdlcnMgbG9uZ2VyIHRoYW4gNjUsNTM1IGVsZW1lbnRzLlxuICAvLyBTZWUgW1dlYktpdCBCdWcgODA3OTddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD04MDc5NylcbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzRW1wdHkob2JqKSkgcmV0dXJuIC1JbmZpbml0eTtcbiAgICB2YXIgcmVzdWx0ID0ge2NvbXB1dGVkIDogLUluZmluaXR5LCB2YWx1ZTogLUluZmluaXR5fTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgY29tcHV0ZWQgPiByZXN1bHQuY29tcHV0ZWQgJiYgKHJlc3VsdCA9IHt2YWx1ZSA6IHZhbHVlLCBjb21wdXRlZCA6IGNvbXB1dGVkfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWluLmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0VtcHR5KG9iaikpIHJldHVybiBJbmZpbml0eTtcbiAgICB2YXIgcmVzdWx0ID0ge2NvbXB1dGVkIDogSW5maW5pdHksIHZhbHVlOiBJbmZpbml0eX07XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGNvbXB1dGVkIDwgcmVzdWx0LmNvbXB1dGVkICYmIChyZXN1bHQgPSB7dmFsdWUgOiB2YWx1ZSwgY29tcHV0ZWQgOiBjb21wdXRlZH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhbiBhcnJheS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJhbmQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBbXTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbShpbmRleCsrKTtcbiAgICAgIHNodWZmbGVkW2luZGV4IC0gMV0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGxvb2t1cCBpdGVyYXRvcnMuXG4gIHZhciBsb29rdXBJdGVyYXRvciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZSA6IGZ1bmN0aW9uKG9iail7IHJldHVybiBvYmpbdmFsdWVdOyB9O1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRvci5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IodmFsdWUpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZSA6IHZhbHVlLFxuICAgICAgICBpbmRleCA6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYSA6IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IDwgcmlnaHQuaW5kZXggPyAtMSA6IDE7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCwgYmVoYXZpb3IpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IodmFsdWUgPT0gbnVsbCA/IF8uaWRlbnRpdHkgOiB2YWx1ZSk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgdmFyIGtleSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgYmVoYXZpb3IocmVzdWx0LCBrZXksIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZ3JvdXAob2JqLCB2YWx1ZSwgY29udGV4dCwgZnVuY3Rpb24ocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gICAgICAoXy5oYXMocmVzdWx0LCBrZXkpID8gcmVzdWx0W2tleV0gOiAocmVzdWx0W2tleV0gPSBbXSkpLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGdyb3VwKG9iaiwgdmFsdWUsIGNvbnRleHQsIGZ1bmN0aW9uKHJlc3VsdCwga2V5KSB7XG4gICAgICBpZiAoIV8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0gPSAwO1xuICAgICAgcmVzdWx0W2tleV0rKztcbiAgICB9KTtcbiAgfTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBpdGVyYXRvciA9PSBudWxsID8gXy5pZGVudGl0eSA6IGxvb2t1cEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4+IDE7XG4gICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W21pZF0pIDwgdmFsdWUgPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHJldHVybiAobiAhPSBudWxsKSAmJiAhZ3VhcmQgPyBzbGljZS5jYWxsKGFycmF5LCAwLCBuKSA6IGFycmF5WzBdO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGhcbiAgLy8gYF8ubWFwYC5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIGFycmF5Lmxlbmd0aCAtICgobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKChuICE9IG51bGwpICYmICFndWFyZCkge1xuICAgICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIE1hdGgubWF4KGFycmF5Lmxlbmd0aCAtIG4sIDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKlxuICAvLyBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIG91dHB1dCkge1xuICAgIGlmIChzaGFsbG93ICYmIF8uZXZlcnkoaW5wdXQsIF8uaXNBcnJheSkpIHtcbiAgICAgIHJldHVybiBjb25jYXQuYXBwbHkob3V0cHV0LCBpbnB1dCk7XG4gICAgfVxuICAgIGVhY2goaW5wdXQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSB8fCBfLmlzQXJndW1lbnRzKHZhbHVlKSkge1xuICAgICAgICBzaGFsbG93ID8gcHVzaC5hcHBseShvdXRwdXQsIHZhbHVlKSA6IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIG91dHB1dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb21wbGV0ZWx5IGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIGFuIGFycmF5LlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBbXSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0b3I7XG4gICAgICBpdGVyYXRvciA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluaXRpYWwgPSBpdGVyYXRvciA/IF8ubWFwKGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkgOiBhcnJheTtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZWFjaChpbml0aWFsLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGlmIChpc1NvcnRlZCA/ICghaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSB2YWx1ZSkgOiAhXy5jb250YWlucyhzZWVuLCB2YWx1ZSkpIHtcbiAgICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShfLmZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKF8udW5pcShhcnJheSksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBfLmV2ZXJ5KHJlc3QsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2Yob3RoZXIsIGl0ZW0pID49IDA7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTsgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuZ3RoID0gXy5tYXgoXy5wbHVjayhhcmd1bWVudHMsIFwibGVuZ3RoXCIpLmNvbmNhdCgwKSk7XG4gICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRzW2ldID0gXy5wbHVjayhhcmd1bWVudHMsICcnICsgaSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICBpZiAobGlzdCA9PSBudWxsKSByZXR1cm4ge307XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBseSB1cyB3aXRoIGluZGV4T2YgKEknbSBsb29raW5nIGF0IHlvdSwgKipNU0lFKiopLFxuICAvLyB3ZSBuZWVkIHRoaXMgZnVuY3Rpb24uIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW5cbiAgLy8gaXRlbSBpbiBhbiBhcnJheSwgb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGkgPSAwLCBsID0gYXJyYXkubGVuZ3RoO1xuICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgaWYgKHR5cGVvZiBpc1NvcnRlZCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpID0gKGlzU29ydGVkIDwgMCA/IE1hdGgubWF4KDAsIGwgKyBpc1NvcnRlZCkgOiBpc1NvcnRlZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpXSA9PT0gaXRlbSA/IGkgOiAtMTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgYXJyYXkuaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSwgaXNTb3J0ZWQpO1xuICAgIGZvciAoOyBpIDwgbDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbGFzdEluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgXy5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBmcm9tKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgICB2YXIgaGFzSW5kZXggPSBmcm9tICE9IG51bGw7XG4gICAgaWYgKG5hdGl2ZUxhc3RJbmRleE9mICYmIGFycmF5Lmxhc3RJbmRleE9mID09PSBuYXRpdmVMYXN0SW5kZXhPZikge1xuICAgICAgcmV0dXJuIGhhc0luZGV4ID8gYXJyYXkubGFzdEluZGV4T2YoaXRlbSwgZnJvbSkgOiBhcnJheS5sYXN0SW5kZXhPZihpdGVtKTtcbiAgICB9XG4gICAgdmFyIGkgPSAoaGFzSW5kZXggPyBmcm9tIDogYXJyYXkubGVuZ3RoKTtcbiAgICB3aGlsZSAoaS0tKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gYXJndW1lbnRzWzJdIHx8IDE7XG5cbiAgICB2YXIgbGVuID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciBpZHggPSAwO1xuICAgIHZhciByYW5nZSA9IG5ldyBBcnJheShsZW4pO1xuXG4gICAgd2hpbGUoaWR4IDwgbGVuKSB7XG4gICAgICByYW5nZVtpZHgrK10gPSBzdGFydDtcbiAgICAgIHN0YXJ0ICs9IHN0ZXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV1c2FibGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHByb3RvdHlwZSBzZXR0aW5nLlxuICB2YXIgY3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICB2YXIgYXJncywgYm91bmQ7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgYm91bmQpKSByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgICB2YXIgc2VsZiA9IG5ldyBjdG9yO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkoc2VsZiwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICBpZiAoT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQmluZCBhbGwgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0XG4gIC8vIGFsbCBjYWxsYmFja3MgZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgZnVuY3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgaWYgKGZ1bmNzLmxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IEVycm9yKFwiYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lc1wiKTtcbiAgICBlYWNoKGZ1bmNzLCBmdW5jdGlvbihmKSB7IG9ialtmXSA9IF8uYmluZChvYmpbZl0sIG9iaik7IH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW8gPSB7fTtcbiAgICBoYXNoZXIgfHwgKGhhc2hlciA9IF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfLmhhcyhtZW1vLCBrZXkpID8gbWVtb1trZXldIDogKG1lbW9ba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpeyByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTsgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIF8uZGVsYXkuYXBwbHkoXywgW2Z1bmMsIDFdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IG5ldyBEYXRlO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH07XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIHJhbiA9IGZhbHNlLCBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyYW4pIHJldHVybiBtZW1vO1xuICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gW2Z1bmNdO1xuICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHdyYXBwZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBfLmNvbXBvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZnVuY3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBmb3IgKHZhciBpID0gZnVuY3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgYXJncyA9IFtmdW5jc1tpXS5hcHBseSh0aGlzLCBhcmdzKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJnc1swXTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBhZnRlciBiZWluZyBjYWxsZWQgTiB0aW1lcy5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYE9iamVjdC5rZXlzYFxuICBfLmtleXMgPSBuYXRpdmVLZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogIT09IE9iamVjdChvYmopKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG9iamVjdCcpO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSB2YWx1ZXMucHVzaChvYmpba2V5XSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBwYWlycyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHBhaXJzLnB1c2goW2tleSwgb2JqW2tleV1dKTtcbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXN1bHRbb2JqW2tleV1dID0ga2V5O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGVhY2goa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoa2V5IGluIG9iaikgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvcHk7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKCFfLmNvbnRhaW5zKGtleXMsIGtleSkpIGNvcHlba2V5XSA9IG9ialtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT09IHZvaWQgMCkgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgdmFyIGVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gICAgLy8gU2VlIHRoZSBbSGFybW9ueSBgZWdhbGAgcHJvcG9zYWxdKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gYSA9PSBTdHJpbmcoYik7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLiBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yXG4gICAgICAgIC8vIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gYSAhPSArYSA/IGIgIT0gK2IgOiAoYSA9PSAwID8gMSAvIGEgPT0gMSAvIGIgOiBhID09ICtiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PSArYjtcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyIHNvdXJjZSBwYXR0ZXJucyBhbmQgZmxhZ3MuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgICByZXR1cm4gYS5zb3VyY2UgPT0gYi5zb3VyY2UgJiZcbiAgICAgICAgICAgICAgIGEuZ2xvYmFsID09IGIuZ2xvYmFsICYmXG4gICAgICAgICAgICAgICBhLm11bHRpbGluZSA9PSBiLm11bHRpbGluZSAmJlxuICAgICAgICAgICAgICAgYS5pZ25vcmVDYXNlID09IGIuaWdub3JlQ2FzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09IGI7XG4gICAgfVxuICAgIC8vIE9iamVjdHMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1aXZhbGVudCwgYnV0IGBPYmplY3Rgc1xuICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShfLmlzRnVuY3Rpb24oYUN0b3IpICYmIChhQ3RvciBpbnN0YW5jZW9mIGFDdG9yKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIChiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuICAgIHZhciBzaXplID0gMCwgcmVzdWx0ID0gdHJ1ZTtcbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoY2xhc3NOYW1lID09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgc2l6ZSA9IGEubGVuZ3RoO1xuICAgICAgcmVzdWx0ID0gc2l6ZSA9PSBiLmxlbmd0aDtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgICAgd2hpbGUgKHNpemUtLSkge1xuICAgICAgICAgIGlmICghKHJlc3VsdCA9IGVxKGFbc2l6ZV0sIGJbc2l6ZV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICAgICAgaWYgKF8uaGFzKGEsIGtleSkpIHtcbiAgICAgICAgICAvLyBDb3VudCB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICAgICAgc2l6ZSsrO1xuICAgICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlci5cbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGZvciAoa2V5IGluIGIpIHtcbiAgICAgICAgICBpZiAoXy5oYXMoYiwga2V5KSAmJiAhKHNpemUtLSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9ICFzaXplO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYiwgW10sIFtdKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLlxuICBlYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiAhIShvYmogJiYgXy5oYXMob2JqLCAnY2FsbGVlJykpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuXG4gIGlmICh0eXBlb2YgKC8uLykgIT09ICdmdW5jdGlvbicpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdG9ycy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVudGl0eU1hcCA9IHtcbiAgICBlc2NhcGU6IHtcbiAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICc8JzogJyZsdDsnLFxuICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgICAgICcvJzogJyYjeDJGOydcbiAgICB9XG4gIH07XG4gIGVudGl0eU1hcC51bmVzY2FwZSA9IF8uaW52ZXJ0KGVudGl0eU1hcC5lc2NhcGUpO1xuXG4gIC8vIFJlZ2V4ZXMgY29udGFpbmluZyB0aGUga2V5cyBhbmQgdmFsdWVzIGxpc3RlZCBpbW1lZGlhdGVseSBhYm92ZS5cbiAgdmFyIGVudGl0eVJlZ2V4ZXMgPSB7XG4gICAgZXNjYXBlOiAgIG5ldyBSZWdFeHAoJ1snICsgXy5rZXlzKGVudGl0eU1hcC5lc2NhcGUpLmpvaW4oJycpICsgJ10nLCAnZycpLFxuICAgIHVuZXNjYXBlOiBuZXcgUmVnRXhwKCcoJyArIF8ua2V5cyhlbnRpdHlNYXAudW5lc2NhcGUpLmpvaW4oJ3wnKSArICcpJywgJ2cnKVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgXy5lYWNoKFsnZXNjYXBlJywgJ3VuZXNjYXBlJ10sIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIF9bbWV0aG9kXSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgaWYgKHN0cmluZyA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgICByZXR1cm4gKCcnICsgc3RyaW5nKS5yZXBsYWNlKGVudGl0eVJlZ2V4ZXNbbWV0aG9kXSwgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGVudGl0eU1hcFttZXRob2RdW21hdGNoXTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbmFtZWQgYHByb3BlcnR5YCBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0IHdpdGggdGhlXG4gIC8vIGBvYmplY3RgIGFzIGNvbnRleHQ7IG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSl7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx0JzogICAgICd0JyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx0fFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBkYXRhLCBzZXR0aW5ncykge1xuICAgIHZhciByZW5kZXI7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldClcbiAgICAgICAgLnJlcGxhY2UoZXNjYXBlciwgZnVuY3Rpb24obWF0Y2gpIHsgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdOyB9KTtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArIFwicmV0dXJuIF9fcDtcXG5cIjtcblxuICAgIHRyeSB7XG4gICAgICByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEpIHJldHVybiByZW5kZXIoZGF0YSwgXyk7XG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBmdW5jdGlvbiBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyAoc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicpICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24sIHdoaWNoIHdpbGwgZGVsZWdhdGUgdG8gdGhlIHdyYXBwZXIuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXyhvYmopLmNoYWluKCk7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0aGlzLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09ICdzaGlmdCcgfHwgbmFtZSA9PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIF8uZXh0ZW5kKF8ucHJvdG90eXBlLCB7XG5cbiAgICAvLyBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gICAgY2hhaW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fY2hhaW4gPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICAgIH1cblxuICB9KTtcblxufSkuY2FsbCh0aGlzKTtcbiJdfQ==
;