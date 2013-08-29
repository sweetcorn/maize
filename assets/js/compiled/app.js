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

var globalUi = require('global-ui');
var NavView = require('./nav');
var ContainerView = require('./container');
var PageView;




PageView = module.exports = Backbone.View.extend({

  initialize: function(options) {
    new NavView({el: $('.js-nav-container'), model: options.edition});
    new ContainerView({el: this.$('.js-main'), model: options.container});

    console.log(globalUi);
    globalUi();
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

module.exports = function(){

  // Resizing
  $(window).resize(function(){
    zoomBaseFontSize();
  });

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


};
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYXBwLmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvYXBwL2JhY2tib25lL2NvbGxlY3Rpb25zL2NvbnRhaW5lcnMuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYmFja2JvbmUvbW9kZWxzL2NvbnRhaW5lci5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2FwcC9iYWNrYm9uZS9tb2RlbHMvZWRpdGlvbi5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2FwcC9iYWNrYm9uZS9yb3V0ZXJzL2FwcC5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2FwcC9iYWNrYm9uZS92aWV3cy9jb250YWluZXIuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYmFja2JvbmUvdmlld3MvbmF2LmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvYXBwL2JhY2tib25lL3ZpZXdzL3BhZ2UuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYmFja2JvbmUvdmlld3MvdGVtcGxhdGUuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9qc29uL2VkaXRpb25zL2NhYzJiMjdjLWZhMDAtNDAwZC1hNjQ0LWJhNjQwOGIyNTY2ZC5qc29uIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvanNvbi9lZGl0aW9ucy9jYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmQvY29udGFpbmVycy8wYWYxNzk2MC1kYjdhLTQ1NTEtYTZmMC1lNmVkNTE0NWQ5ZTguanNvbiIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2pzb24vZWRpdGlvbnMvY2FjMmIyN2MtZmEwMC00MDBkLWE2NDQtYmE2NDA4YjI1NjZkL2NvbnRhaW5lcnMvOTUwMTc5NTMtY2NhNC00ZDExLWFjYjgtMTNlYzVkNjU3Y2RlLmpzb24iLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9qc29uL2VkaXRpb25zL2NhYzJiMjdjLWZhMDAtNDAwZC1hNjQ0LWJhNjQwOGIyNTY2ZC9jb250YWluZXJzL2NjYWI3YzZlLWVjMTUtNDFkMS1hYmNmLTJmNGE5M2MxZWRlOS5qc29uIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvanNvbi9lZGl0aW9ucy9jYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmQvY29udGFpbmVycy9lOGIwYmU3Yi1lZWJjLTRhNGMtOTgyNC1hNzgyMzg5NDdlZGEuanNvbiIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2pzb24vZWRpdGlvbnMvY2FjMmIyN2MtZmEwMC00MDBkLWE2NDQtYmE2NDA4YjI1NjZkL2NvbnRhaW5lcnMvZTlkZGFhZDMtODNjNi00NjYyLWE0NjEtNGJlNzBkNzY1ODQ2Lmpzb24iLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9qc29uL2VkaXRpb25zL2NhYzJiMjdjLWZhMDAtNDAwZC1hNjQ0LWJhNjQwOGIyNTY2ZC9jb250YWluZXJzL2ZiNGE5ZTE3LTY2NjUtNGQ0OC1hOTY0LWE4MmM1MGNkZTQ3YS5qc29uIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvanNvbi9lZGl0aW9ucy9jYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmQvY29udGFpbmVycy9pbmRleC5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2pzb24vZWRpdGlvbnMvaW5kZXguanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9qc29uL2luZGV4LmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvbGliL2dsb2JhbC11aS5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2xpYi9oYW5kbGViYXJzX2hlbHBlcnMuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgJCA9IHJlcXVpcmUoJ2pRdWVyeScpO1xudmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgQXBwUm91dGVyID0gcmVxdWlyZSgnLi9iYWNrYm9uZS9yb3V0ZXJzL2FwcCcpO1xuXG5yZXF1aXJlKCd0ZW1wbGF0ZXMnKShyZXF1aXJlKCdoYW5kbGViYXJzJykpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgcm91dGVyID0gbmV3IEFwcFJvdXRlcigpO1xuXG4gIC8vIHN0YXJ0IGxpc3RlbmluZyBmb3IgcGF0aCBjaGFuZ2VzXG4gIG9wdGlvbnMucHVzaFN0YXRlID0gdHJ1ZTtcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICBCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KG9wdGlvbnMpO1xuICB9KTtcbn0pKCk7IiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxudmFyIENvbnRhaW5lciA9IHJlcXVpcmUoJy4uL21vZGVscy9jb250YWluZXInKTtcbnZhciBDb250YWluZXJzO1xuXG5cblxuQ29udGFpbmVycyA9IG1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG4gIG1vZGVsOiBDb250YWluZXJcblxufSkiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG52YXIgQ29udGFpbmVyO1xuXG5cblxuXG5Db250YWluZXIgPSBtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cbiAgZmV0Y2g6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudHJpZ2dlcignc3luYycpO1xuICB9XG5cbn0pOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxudmFyIENvbnRhaW5lcnMgPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9jb250YWluZXJzJyk7XG52YXIganNvbiA9IHJlcXVpcmUoJy4uLy4uLy4uL2pzb24nKTtcbnZhciBFZGl0aW9uO1xuXG5cblxuXG5FZGl0aW9uID0gbW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXG4gIGRlZmF1bHRzOiB7XG4gICAgaWQ6ICdjYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmQnXG4gIH1cblxuLCBmZXRjaDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhdGEgPSBqc29uLmVkaXRpb25zW3RoaXMuZ2V0KCdpZCcpXTtcbiAgICB2YXIgZWRpdGlvbiA9IGpzb24uZWRpdGlvbnNbdGhpcy5nZXQoJ2lkJyldLmVkaXRpb247XG5cbiAgICB0aGlzLnNldChlZGl0aW9uKTtcblxuICAgIHZhciBjb250YWluZXJzID0gXy5tYXAoZGF0YS5jb250YWluZXJzLCBmdW5jdGlvbihjb250YWluZXIpe1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKGNvbnRhaW5lciwge2VkaXRpb246IF8ucGljayhlZGl0aW9uLCAnaWQnLCAndGl0bGUnKX0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jb250YWluZXJzID0gbmV3IENvbnRhaW5lcnMoY29udGFpbmVycyk7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3N5bmMnKTtcbiAgfSxcblxufSkiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG52YXIgRWRpdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9lZGl0aW9uJyk7XG52YXIgQ29udGFpbmVyID0gcmVxdWlyZSgnLi4vbW9kZWxzL2NvbnRhaW5lcicpO1xudmFyIFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvcGFnZScpO1xudmFyIEFwcFJvdXRlcjtcblxuXG5cblxuQXBwUm91dGVyID0gbW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcblxuICByb3V0ZXM6IHtcbiAgICAnJzogJ2luZGV4JyxcbiAgICAnZWRpdGlvbnMvOmlkJzogJ2VkaXRpb24nLFxuICAgICdlZGl0aW9ucy86aWQvY29udGFpbmVycy86aWQnOiAnY29udGFpbmVyJ1xuICB9XG5cbiwgcmVuZGVyVmlldzogZnVuY3Rpb24oZWRpdGlvbklkLCBjb250YWluZXJJZCkge1xuICAgIHZhciBlZGl0aW9uID0gKGVkaXRpb25JZCkgPyBuZXcgRWRpdGlvbih7aWQ6IGVkaXRpb25JZH0pIDogbmV3IEVkaXRpb24oKTtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZWRpdGlvbi5vbignc3luYycsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF9lZGl0aW9uID0gZWRpdGlvbjtcbiAgICAgIHZhciBjb250YWluZXIgPSAoY29udGFpbmVySWQpID8gZWRpdGlvbi5jb250YWluZXJzLmZpbmRXaGVyZSh7aWQ6IGNvbnRhaW5lcklkfSkgOiBlZGl0aW9uLmNvbnRhaW5lcnMubW9kZWxzWzBdO1xuICAgICAgdmFyIF9fdGhpcyA9IF90aGlzO1xuXG4gICAgICBjb250YWluZXIub24oJ3N5bmMnLCBmdW5jdGlvbigpe1xuICAgICAgICBfX3RoaXMubmF2aWdhdGUoJy9lZGl0aW9ucy8nICsgX2VkaXRpb24uaWQgKyAnL2NvbnRhaW5lcnMvJyArIGNvbnRhaW5lci5pZCwge3JlcGxhY2U6IHRydWV9KTtcbiAgICAgICAgbmV3IFBhZ2VWaWV3KHtlbDogJCgnLmpzLWJvZHknKSwgZWRpdGlvbjogX2VkaXRpb24sIGNvbnRhaW5lcjogY29udGFpbmVyfSk7XG4gICAgICB9KTtcblxuICAgICAgY29udGFpbmVyLmZldGNoKCk7XG4gICAgfSk7XG5cbiAgICBlZGl0aW9uLmZldGNoKCk7XG4gIH1cblxuLCBpbmRleDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW5kZXJWaWV3KClcbiAgfVxuXG4sIGVkaXRpb246IGZ1bmN0aW9uKGVkaXRpb25JZCkge1xuICAgIHRoaXMucmVuZGVyVmlldyhlZGl0aW9uSWQpO1xuICB9XG5cbiwgY29udGFpbmVyOiBmdW5jdGlvbihlZGl0aW9uSWQsIGNvbnRhaW5lcklkKSB7XG4gICAgdGhpcy5yZW5kZXJWaWV3KGVkaXRpb25JZCwgY29udGFpbmVySWQpO1xuICB9XG5cbn0pO1xuIiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG52YXIgVGVtcGxhdGVWaWV3ID0gcmVxdWlyZSgnLi90ZW1wbGF0ZScpO1xudmFyIENvbnRhaW5lclZpZXc7XG5cblxuXG5cbkNvbnRhaW5lclZpZXcgPSBtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4sIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBlZGl0aW9uID0gdGhpcy5tb2RlbC5nZXQoJ2VkaXRpb24nKTtcbiAgICB2YXIgY29udGFpbmVyID0gXy5waWNrKHRoaXMubW9kZWwuYXR0cmlidXRlcywgJ2lkJywgJ3RpdGxlJywgJ251bWJlcicpO1xuXG4gICAgXy5lYWNoKHRoaXMubW9kZWwuZ2V0KCdwYWdlcycpLCBmdW5jdGlvbihwYWdlKXtcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gXy5leHRlbmQocGFnZSwge2VkaXRpb246IGVkaXRpb24sIGNvbnRhaW5lcjogY29udGFpbmVyfSk7XG4gICAgICB2YXIgbW9kZWwgPSBuZXcgQmFja2JvbmUuTW9kZWwoYXR0cmlidXRlcyk7XG4gICAgICB2YXIgdmlldyA9IG5ldyBUZW1wbGF0ZVZpZXcoe21vZGVsOiBtb2RlbH0pO1xuICAgICAgX3RoaXMuJGVsLmFwcGVuZCh2aWV3LnJlbmRlcigpLmVsKTtcbiAgICB9KTtcbiAgfVxuXG59KSIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbnZhciBFZGl0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL2VkaXRpb24uanMnKTtcbnZhciBOYXZWaWV3O1xuXG5cblxuTmF2VmlldyA9IG1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gIHRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gSlNULm5hdjtcbiAgfVxuXG4sIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiwgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaHRtbCA9IHRoaXMudGVtcGxhdGUoKSh0aGlzLm1vZGVsLnRvSlNPTigpKTtcbiAgICB0aGlzLiRlbC5odG1sKGh0bWwpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufSkiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG52YXIgZ2xvYmFsVWkgPSByZXF1aXJlKCdnbG9iYWwtdWknKTtcbnZhciBOYXZWaWV3ID0gcmVxdWlyZSgnLi9uYXYnKTtcbnZhciBDb250YWluZXJWaWV3ID0gcmVxdWlyZSgnLi9jb250YWluZXInKTtcbnZhciBQYWdlVmlldztcblxuXG5cblxuUGFnZVZpZXcgPSBtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgbmV3IE5hdlZpZXcoe2VsOiAkKCcuanMtbmF2LWNvbnRhaW5lcicpLCBtb2RlbDogb3B0aW9ucy5lZGl0aW9ufSk7XG4gICAgbmV3IENvbnRhaW5lclZpZXcoe2VsOiB0aGlzLiQoJy5qcy1tYWluJyksIG1vZGVsOiBvcHRpb25zLmNvbnRhaW5lcn0pO1xuXG4gICAgY29uc29sZS5sb2coZ2xvYmFsVWkpO1xuICAgIGdsb2JhbFVpKCk7XG4gIH1cblxufSk7IiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxudmFyIEJhc2VWaWV3O1xuXG5cblxuXG5CYXNlVmlldyA9IG1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gIHRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gSlNUWydwYWdlcy4nICsgdGhpcy5tb2RlbC5nZXQoJ3RlbXBsYXRlJykudG9Mb3dlckNhc2UoKV07XG4gIH1cblxuLCByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBodG1sID0gdGhpcy50ZW1wbGF0ZSgpKHRoaXMubW9kZWwudG9KU09OKCkpO1xuICAgIHRoaXMuJGVsLmh0bWwoaHRtbCk7XG4gICAgdGhpcy5zZXRFbGVtZW50KHRoaXMuJCgnc2VjdGlvbicpKVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufSk7IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiaWRcIjogXCJjYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmRcIixcbiAgICBcInRpdGxlXCI6IFwiU21hcnRlciBDbG91ZFwiLFxuICAgIFwiY29udGFpbmVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCIwYWYxNzk2MC1kYjdhLTQ1NTEtYTZmMC1lNmVkNTE0NWQ5ZThcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCI6IFwiMDFcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJJZGVhcyBvbiBhIHBhZ2VcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiZDA5OGQ5MzUtNDcwZS00NTZkLWFlMzAtMjk0YjU3NmYyOGUwXCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjAyXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiVGhyZWUgaW1wb3J0YW50IHNoaWZ0cyBpbiB0aGUgd29ybGRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiZTlkZGFhZDMtODNjNi00NjYyLWE0NjEtNGJlNzBkNzY1ODQ2XCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjAzXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiVGhyZWUgbXVzdC1yZWFkc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI5NTAxNzk1My1jY2E0LTRkMTEtYWNiOC0xM2VjNWQ2NTdjZGVcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCI6IFwiMDRcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGUgbmV3IHdheSBmb3J3YXJkXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjQ5YmIxNDZjLWY3N2UtNDM4YS04MzEwLWQyOWM0OGNmZDMyZlwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIwNVwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRoZSBuZXcgb3V0Y29tZXNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiZTgxY2E2N2MtZTkzMi00MjhmLWI4M2UtZmMxZDczY2QxZjEzXCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjA2XCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiSW1wb3J0YW50IGNvbnZlcnNhdGlvbnMgdG8gaGF2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI5YjI3MWViYy03Mjk0LTQ3ZTAtYTRhNC1lZmExYmQ5MDNlM2VcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCI6IFwiMDdcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJPcHBvcnR1bml0aWVzIGZvciBpbm5vdmF0aW9uXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjQ1NzEzY2NmLWJmZGYtNGE3Ni1hYmU5LTEzMzdkZTM2MDgzM1wiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIwOFwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRoZSBJQk0gaW5kdXN0cnkgcGVyc3BlY3RpdmVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiOGExOGE5MGUtZTU1ZC00YzFjLTk1NWMtOGVmNjZlMjdlNGE1XCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjA5XCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiV2h5IElCTSBiZWF0cyB0aGUgY29tcGV0aXRpb25cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiZmI0YTllMTctNjY2NS00ZDQ4LWE5NjQtYTgyYzUwY2RlNDdhXCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjEwXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiVGhlIG5ldyB2b2NhYnVsYXJ5XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImNjYWI3YzZlLWVjMTUtNDFkMS1hYmNmLTJmNGE5M2MxZWRlOVwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIxMVwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIldoeSBpbmZyYXN0cnVjdHVyZSBtYXR0ZXJzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImU4YjBiZTdiLWVlYmMtNGE0Yy05ODI0LWE3ODIzODk0N2VkYVwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIxMlwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRoZSBzeXN0ZW0gY2hvaWNlc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJhYjJlZWNjNi1hNTBlLTQxZTktYmE4YS1mNmNjMmUxNWRiNmVcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCI6IFwiMTNcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJQYXJ0bmVyaW5nIG9wdGlvbnMgdG8gZXhwbG9yZVwiXG4gICAgICAgIH1cbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiaWRcIjogXCIwYWYxNzk2MC1kYjdhLTQ1NTEtYTZmMC1lNmVkNTE0NWQ5ZThcIixcbiAgICBcIm51bWJlclwiOiBcIjAxXCIsXG4gICAgXCJ0aXRsZVwiOiBcIklkZWFzIG9uIGEgcGFnZVwiLFxuICAgIFwicGFnZXNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiNGVkYmM3NWUtNDU2OC00MTBhLWE5NGYtZWYzOTZkMTVhNDUzXCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiSTFcIixcbiAgICAgICAgICAgIFwiYm9keVwiOiBcIkhvdyB5b3Ugc2hvdWxkIGJlIHRoaW5raW5nIGFib3V0IGNsb3VkLCBhbmQgd2hlcmUgdG8gc3RhcnRcIixcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJpbWFnZS5qcGdcIixcbiAgICAgICAgICAgICAgICBcInVybEAyeFwiOiBcImltYWdlQDJ4LmpwZ1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCIzYjYwZTNkMy04ZTY0LTQyYzctOWZjYi03NWE5OWU0MzM0NjdcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJUMVwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkNsb3VkIGlzIGEgYnVzaW5lc3MgZ3Jvd3RoIGVuZ2luZS4gQmV5b25kIHJldGhpbmtpbmcgSVQsIGl0IGlzIGEgcGF0aCBmb3IgcmVpbnZlbnRpbmcgYnVzaW5lc3MuXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjE2MTQ3NDY4LTk1OWUtNDk1Zi05MmY1LTQzZmJhNWM4YTFjMlwiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkExXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiR2V0IGZhc3RlclwiLFxuICAgICAgICAgICAgXCJib2R5XCI6IFwiVG8gZHJpdmUgaW5ub3ZhdGlvbiBhbmQgbWVldCB0aGUgaW5jcmVhc2luZyBleHBlY3RhdGlvbnMgb2YgY29uc3VtZXJzLCBlbXBsb3llZXMsIHN1cHBsaWVycyBhbmQgcGFydG5lcnMsIG9yZ2FuaXphdGlvbnMgbXVzdCBjb250aW51b3VzbHkgYW5kIG1vcmUgcXVpY2tseSBkZXZlbG9wLCBkZXBsb3kgYW5kIGltcHJvdmUgYXBwbGljYXRpb25zIGFuZCBzZXJ2aWNlcy5cIixcbiAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJoaWdobGlnaHRcIjogXCI3MiVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwib2YgQ0VPcyBzdXJ2ZXllZCBzZWUgdGhlIG5lZWQgdG8gaW1wcm92ZSByZXNwb25zZSB0aW1lIHRvIG1hcmtldC5cXG5cXG5CYXNlZCBvbiBJQk0gUHVyZXN5c3RlbXNUTSByZXNlYXJjaC5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjBcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImhpZ2hsaWdodFwiOiBcIjU4JVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJvZiBjb21wYW5pZXMgbW92ZSB0byB0aGUgcHJpdmF0ZSBjbG91ZCB0byBnYWluIGFnaWxpdHkgYW5kIHNwZWVkLlxcblxcbkZwd2ViLm5ldCwgXFxcInZhbHVlIG9mIHRoZSBwcml2YXRlIGNsb3VkXFxcIiBpbmZvZ3JhcGhpYywgbWF5IDE0LCAyMDEzLlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiMGQ0MGU4MTMtZjkxMy00M2I4LThkMTctYzg1YjIyNDhmMGE5XCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiQTFcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJHZXQgZW1wb3dlcmVkXCIsXG4gICAgICAgICAgICBcImJvZHlcIjogXCJJdCBpcyB1bmRlciBwcmVzc3VyZSB0byByYXBpZGx5IGRlbGl2ZXIgaW50dWl0aXZlLCBvbi1kZW1hbmQgYWNjZXNzIHRvIGJ1c2luZXNzIHNlcnZpY2VzIGFjcm9zcyB0aGUgZW50ZXJwcmlzZSBhbmQgdG8gc3BlZWQgYXBwbGljYXRpb24gYW5kIHNlcnZpY2UgZGVwbG95bWVudCBieSBlbmFibGluZyBkZXZlbG9wZXJzIHRvIGNyZWF0ZSB0aGVpciBvd24gZGV2ZWxvcG1lbnQgYW5kIHRlc3QgZW52aXJvbm1lbnRzLlwiLFxuICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjBcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImhpZ2hsaWdodFwiOiBcIjQ1JVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJvZiBDRk9zIG5lZWQgaW1wcm92ZWQgdGVjaG5vbG9neSBzdXBwb3J0IGZvciB0aGUgcXVhbGl0eSBvZiB0aGUgZGF0YSB1c2VkIGZvciBidXNpbmVzcyBkZWNpc2lvbnMuXFxuXFxuRmluYW5jaWFsIGV4ZWN1dGl2ZXMgaW50ZXJuYXRpb25hbCwgXFxcInRoZSBDRk8ncyB0b3AgdGVjaG5vbG9neSBpbXBlcmF0aXZlcyxcXFwiIEpvaG4gZS4gVmFuIGRlY2tlciBhbmQgV2lsbGlhbSBtLiBTaW5uZXR0LCBKdW5lIDIwMTMuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJoaWdobGlnaHRcIjogXCIzNiVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwib2YgYnVzaW5lc3MgbGVhZGVycyBtYW5hZ2UgY2xvdWQgc2VydmljZXMgd2l0aG91dCBpbnZvbHZlbWVudCBvciBzdXBwb3J0IG9mIGl0LlxcblxcbklCTSBjZW50ZXIgZm9yIGFwcGxpZWQgaW5zaWdodHMsIGNsb3VkIGdsb2JhbCBzdHVkeSwgMjAxMy5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjRmM2QxMTNmLWQyZjAtNDA1Ni1iODExLWE4MGI3OGRlMTg1M1wiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkExXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiR2V0IGVmZmljaWVudFwiLFxuICAgICAgICAgICAgXCJib2R5XCI6IFwiT3JnYW5pemF0aW9ucyBtdXN0IGltcHJvdmUgdGhlIGVjb25vbWljcyBvZiBpdCwgdXNpbmcgc2VsZi1zZXJ2aWNlIGJ1c2luZXNzIHNlcnZpY2VzIGFuZCBhcHBsaWNhdGlvbnMgd2l0aCBhIHVzZS1iYXNlZCBwYXltZW50IG1vZGVsLCBhZGRpbmcgbmV3IGNhcGFiaWxpdGllcyBhbmQgY2FwYWNpdHkgYXMgbmVlZGVkLCBhbmQgbWF4aW1pemluZyB0aGUgdmFsdWUgb2YgZXhpc3RpbmcgaW5mcmFzdHJ1Y3R1cmUuXCIsXG4gICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJyXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiXCI6IFwiMFwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiaGlnaGxpZ2h0XCI6IFwiNzYlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIm9mIGl0IGRlY2lzaW9uIG1ha2VycyBhcmUgY29uY2VybmVkIG9yIHZlcnkgY29uY2VybmVkIGJ5IHRoZSByaXNpbmcgcHJlc3N1cmUgdG8gcmVkdWNlIGNvc3RzLlxcblxcbkZvcnJlc3RlciBjb25zdWx0aW5nLCBjaGFsbGVuZ2luZyB0aGUgc3RhdHVzIHF1byBvbiBtYWludGVuYW5jZSBjb250cmFjdHMgYW5kIHJlZnJlc2ggY3ljbGVzIHRvIGxvd2VyIGNvc3RzLCBtYXkgMjAxMy5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjBcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImhpZ2hsaWdodFwiOiBcIjMxJVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJvZiBleGVjdXRpdmVzIHN1cnZleWVkIGNpdGVkIGNsb3VkJ3MgYWJpbGl0eSB0byByZWR1Y2UgZml4ZWQgaXQgY29zdHMgYW5kIHNoaWZ0IHRvIGEgbW9yZSB2YXJpYWJsZSBcXFwicGF5IGFzIHlvdSBnb1xcXCIgY29zdCBzdHJ1Y3R1cmUgYXMgYSB0b3AgYmVuZWZpdC5cXG5cXG5JQk0sIHRoZSBwb3dlciBvZiBjbG91ZDogZHJpdmluZyBidXNpbmVzcyBtb2RlbCBpbm5vdmF0aW9uLCBGZWJydWFyeSAyMDEyLlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImlkXCI6IFwiOTUwMTc5NTMtY2NhNC00ZDExLWFjYjgtMTNlYzVkNjU3Y2RlXCIsXG4gICAgXCJudW1iZXJcIjogXCIwNFwiLFxuICAgIFwidGl0bGVcIjogXCJUaGUgbmV3IHdheSBmb3J3YXJkXCIsXG4gICAgXCJwYWdlc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI3ODkyY2ExMS1kZmQ0LTQ4NzAtYmM2Ny1lOTEyYmE3ZjllMDZcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJJMVwiLFxuICAgICAgICAgICAgXCJib2R5XCI6IFwiV2hhdCBJQk0gYW5kIG91ciBjbGllbnRzIGNhbiBhY2hpZXZlIHRvZ2V0aGVyLWxhaWQgb3V0IGluIGEgY29tbW9uIGZyYW1lXCIsXG4gICAgICAgICAgICBcImJhY2tncm91bmRcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwiaW1hZ2UuanBnXCIsXG4gICAgICAgICAgICAgICAgXCJ1cmxAMnhcIjogXCJpbWFnZUAyeC5qcGdcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiNTg1YjQ2OWQtNzlkNS00NDgxLTg2Y2MtYWJlNjE3NzIxMDkzXCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiTTRcIixcbiAgICAgICAgICAgIFwiZ3JhcGhpY1wiOiBcImltYWdlLnN2Z1wiLFxuICAgICAgICAgICAgXCJsaW5rc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjI1NVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIyNTVcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJSZWludmVudCByZXN0bGVzc2x5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb24uc3ZnXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCIxMTY3ZWJmNC0zOTcwLTRjNjEtYTZhZi0xYzMxZjg4Y2MwZTVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJBM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJlaW52ZW50IHJlc3RsZXNzbHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VidGl0bGVcIjogXCJJbm5vdmF0ZSBtb3JlIHRoYW4gcHJvZHVjdHMgYW5kIHNlcnZpY2VzLWlubm92YXRlIHRvIHJlaW52ZW50IHlvdXIgYnVzaW5lc3MuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJXaGF0IGl0IG1lYW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlRoZSBpbmZsdWVuY2Ugb2YgY2xvdWQgcGVybWVhdGVzIG9yZ2FuaXphdGlvbmFsIGN1bHR1cmVzLCBkcml2aW5nIGEgcmFkaWNhbCByZXRoaW5raW5nIG9mIGhvdyBidXNpbmVzcyBsZWFkZXJzIGFwcHJvYWNoIHRoZWlyIHJvbGVzIGFuZCwgdWx0aW1hdGVseSwgaG93IHdvcmsgZ2V0cyBkb25lLiBDbG91ZCBjYW4gc3BlZWQgYWNjZXNzIHRvIHRydXN0ZWQgaW5mb3JtYXRpb24gYW5kIGluc2lnaHRzLCBlYXNlIGNvbGxhYm9yYXRpb24sIGFuZCBlbmFibGUgdGhlIHJlbGVudGxlc3MgcHVyc3VpdCBvZiBiZXR0ZXIgYnVzaW5lc3Mgb3V0Y29tZXMuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIldobyBCZW5lZml0c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJDLXN1aXRlXFxuUHJvZHVjdCBtYW5hZ2VtZW50XFxuRW50ZXJwcmlzZSBhcmNoaXRlY3RzXFxuQXBwbGljYXRpb24gZGV2ZWxvcGVyc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYnV0dG9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiUXVlc3Rpb25zIHRvIHRoaW5rIGFib3V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiOWIzYmQ4ODEtZDVlNC00Mjk3LWIzMDgtZmFiMzEwZDM2M2VlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJxdWVzdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIklzIHlvdXIgb3JnYW5pemF0aW9uYWwgY3VsdHVyZSBvcGVuIHRvIHJlaW52ZW50aW9uP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvdyBkb2VzIHlvdXIgaW5mcmFzdHJ1Y3R1cmUgZW5hYmxlIGFnaWxpdHkgdG8gc3VwcG9ydCByYXBpZCBjaGFuZ2VzIHRvIHByb2Nlc3NlcyBhbmQgc3lzdGVtcz9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJIb3cgaGFzIHlvdXIgc2VuaW9yIGxlYWRlcnNoaXAgZGVtb25zdHJhdGVkIGNvbW1pdG1lbnQgdG8gY29udGludW91cyB0b3AtZG93biBhbmQgYm90dG9tLXVwIGlubm92YXRpb24/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBkZWdyZWUgb2YgZXhwZXJ0aXNlIGFuZCBhY3VtZW4gZG9lcyB5b3VyIHdvcmtmb3JjZSBoYXZlIHRvIGltYWdpbmUgYW5kIGltcGxlbWVudCBjaGFuZ2U/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG93IG1pZ2h0IGNsb3VkIHRlY2hub2xvZ2llcyBjaGFuZ2UgdGhlIHdheSB5b3Ugd29yayB3aXRoIHBhcnRuZXJzIGFuZCBzdXBwbGllcnM/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjI1NVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIyNTVcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJFbXBvd2VyIHRocm91Z2ggaW5zaWdodHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbi5zdmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjgxNGI1NTJiLTA1YzctNGYxNi1hYzVkLTAwZWEyNTI4ZjI3OVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkEzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRW1wb3dlciB0aHJvdWdoIGluc2lnaHRzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1YnRpdGxlXCI6IFwiRGVlcGVuIGtub3dsZWRnZSBvZiBjdXN0b21lcnMsIHBhcnRuZXJzLCBzdXBwbGllcnMgYW5kIHByb2Nlc3Nlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiV2hhdCBpdCBtZWFuc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJBcyBuZXcgdGVjaG5vbG9naWVzIGNyZWF0ZSBuZXcgdHlwZXMgYW5kIHNvdXJjZXMgb2YgZGF0YSwgbGVhZGVycyBhcmUgdXNpbmcgYW5hbHl0aWNzIHRvIGluZm9ybSBhbmQgZW1wb3dlciB3b3JrZXJzIHRvIHNlaXplIGVtZXJnaW5nIG9wcG9ydHVuaXRpZXMuIFRocm91Z2ggY2xvdWQtYmFzZWQgYW5hbHl0aWNzLCBidXNpbmVzcyB1c2VycyBjYW4gZGVlcGVuIHRoZWlyIHVuZGVyc3RhbmRpbmcgb2YgY3VzdG9tZXJzLCBjb21wZXRpdG9ycyBhbmQgdGhlIGNvbXBsZXRlIHZhbHVlIGNoYWluLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJXaG8gQmVuZWZpdHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiU2FsZXNcXG5DdXN0b21lciBzZXJ2aWNlXFxuUHJvY3VyZW1lbnRcXG5TdXBwbHkgY2hhaW5cXG5NZXJjaGFuZGlzaW5nXFxuSHVtYW4gcmVzb3VyY2VzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJidXR0b25cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJRdWVzdGlvbnMgdG8gdGhpbmsgYWJvdXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCIwY2MwOTk3NS04OTMxLTRjZjUtYmVlNC1hZTgwODg4Y2RlYTFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPN1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1ZXN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBoYXZlIHlvdSBkb25lIHRvIGVuYWJsZSB5b3VyIG9yZ2FuaXphdGlvbiB0byBkZWxpdmVyIHNlcnZpY2VzIHRoYXQgYW50aWNpcGF0ZSBjdXN0b21lciBuZWVkcz9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IGluc2lnaHRzIGRvIHlvdSBrbm93IGFyZSBvdXQgdGhlcmUgaW4gdGhlIGRhdGEsIGlmIG9ubHkgeW91IGNvdWxkIGJyaW5nIHRvZ2V0aGVyIGFuZCBhbmFseXplIHRoZSByaWdodCBkYXRhP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgY291bGQgeW91ciBvcmdhbml6YXRpb24gZG8gZGlmZmVyZW50bHkgaWYgYnVzaW5lc3MgdXNlcnMgaGFkIHNlbGYtc2VydmljZSBhY2Nlc3MgdG8gYW5hbHl0aWNzIGFwcGxpY2F0aW9ucyBpbiB0aGUgY2xvdWQ/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBzdGVwcyBoYXMgeW91ciBvcmdhbml6YXRpb24gdGFrZW4gdG8gaW50ZWdyYXRlIGl0cyBhbmFseXRpY3MgYW5kIGNsb3VkIHN0cmF0ZWdpZXM/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBhcmUgeW91IGRvaW5nIHRvIGVuYWJsZSB5b3VyIG9yZ2FuaXphdGlvbiB0byBhbnRpY2lwYXRlIGN1c3RvbWVyIG5lZWRzP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjI1NVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiXCI6IFwiMjU1XCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiT3JjaGVzdHJhdGUgZHluYW1pYyBjbG91ZHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbi5zdmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjFhNTU0ODdiLWRkM2EtNDM3Ny05OGZjLTFmZGNmYTRkNjMzOFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkEzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiT3JjaGVzdHJhdGUgZHluYW1pYyBjbG91ZHNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VidGl0bGVcIjogXCJJbXByb3ZlIGJ1c2luZXNzIHByb2Nlc3NlcyBhbmQgc2VjdXJpdHksIGFuZCBlbmhhbmNlIGFnaWxpdHkgYW5kIHJlc3BvbnNpdmVuZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJXaGF0IGl0IG1lYW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkFzIHJlcXVpcmVtZW50cyBjaGFuZ2UsIG9wcG9ydHVuaXRpZXMgYXJlIGlkZW50aWZpZWQgb3IgdGhyZWF0cyBhcmlzZSwgaXQgbXVzdCBiZSByZWFkeS4gSW4gdGhlIGNvbXBldGl0aXZlIG1hcmtldHBsYWNlLCBhZHZhbnRhZ2Ugd2lsbCBnbyB0byB0aG9zZSB3aG8gY2FuIGFkYXB0IGluc3RhbnRseS1keW5hbWljYWxseSBjb25zdW1pbmcgYW5kIGRlbGl2ZXJpbmcgY3JpdGljYWwgY2FwYWJpbGl0aWVzIHRocm91Z2ggdGhlIHJpZ2h0IGNvbWJpbmF0aW9uIG9mIHB1YmxpYywgcHJpdmF0ZSBhbmQgaHlicmlkIGNsb3Vkcy5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiV2hvIEJlbmVmaXRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlByb2N1cmVtZW50XFxuU3VwcGx5IGNoYWluXFxuTWVyY2hhbmRpc2luZ1xcbk1hcmtldGluZ1xcbkl0XFxuSHVtYW4gcmVzb3VyY2VzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJidXR0b25cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJRdWVzdGlvbnMgdG8gdGhpbmsgYWJvdXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJiM2JiOWNmNC1hZTE2LTQzZDYtYTljZS02MWJjOWQyNThhNTlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPN1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1ZXN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBhcmUgeW91IG5vdCBhYmxlIHRvIGRlbGl2ZXIgdGhyb3VnaCB0aGUgY2xvdWQ/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG93IGZhciBhbG9uZyBhcmUgeW91IGluIHVzaW5nIGEgdmFyaWV0eSBvZiBjbG91ZCBtb2RlbHMtcHVibGljLCBwcml2YXRlIGFuZCBoeWJyaWQ/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG93IGRvIHlvdSBkZXRlcm1pbmUgd2hlcmUgdG8gcnVuIGEgZ2l2ZW4gcHJvY2VzcyBvciBhcHBsaWNhdGlvbiBmcm9tIGEgYnVzaW5lc3MgYW5kIHRlY2hub2xvZ3kgcGVyc3BlY3RpdmU/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hpY2ggY2xvdWQtYmFzZWQgYnVzaW5lc3Mgc29sdXRpb25zIGFuZCBzZXJ2aWNlcyBhcmUgeW91IGN1cnJlbnRseSB1c2luZz8gV2h5IHRob3NlP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgYXBwZWFscyB0byB5b3UgbW9zdCBhYm91dCBjbG91ZCBzZXJ2aWNlcz8gV2hhdCBjb25jZXJucyBkbyB5b3UgaGF2ZT9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImlkXCI6IFwiY2NhYjdjNmUtZWMxNS00MWQxLWFiY2YtMmY0YTkzYzFlZGU5XCIsXG4gICAgXCJudW1iZXJcIjogXCIxMVwiLFxuICAgIFwidGl0bGVcIjogXCJXaHkgaW5mcmFzdHJ1Y3R1cmUgbWF0dGVyc1wiLFxuICAgIFwicGFnZXNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiNDk4MGI0ZDAtN2VhZi00NjEwLTk4OTAtZTkyMjgzYTU0NGZmXCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiSTFcIixcbiAgICAgICAgICAgIFwiYm9keVwiOiBcIkV4cGxvcmluZyB0aGUgaW50ZXJzZWN0aW9uIG9mIGJ1c2luZXNzIG91dGNvbWVzIGFuZCBpbmZyYXN0cnVjdHVyZSBzdHJhdGVnaWVzXCIsXG4gICAgICAgICAgICBcImJhY2tncm91bmRcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwiaW1hZ2UuanBnXCIsXG4gICAgICAgICAgICAgICAgXCJ1cmxAMnhcIjogXCJpbWFnZUAyeC5qcGdcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiNWNjN2E5ZTctY2Y3Zi00ZTlmLWE0ZTgtMjYzNGU2ZDlhOGYxXCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiVDJcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJJdCBtYXR0ZXJzIGJlY2F1c2UgYnVzaW5lc3Mgb3V0Y29tZXMgbWF0dGVyIGFuZCBuZXcgb3V0Y29tZXMgZW50YWlsIG5ldyBkZW1hbmRzLlwiLFxuICAgICAgICAgICAgXCJib2R5XCI6IFwiXFxcIkEgd2lkZSByYW5nZSBvZiBpbm5vdmF0aW9ucyBpcyBoYXBwZW5pbmcgYXQgdGhlIGluZnJhc3RydWN0dXJlIGxheWVyLCBhcyBjb250aW51ZWQgaGFyZHdhcmUgaW1wcm92ZW1lbnRzIGRyaXZlIG5ldyBjYXBhYmlsaXRpZXMgZm9yIGNvbXB1dGUsIHN0b3JhZ2UsIGFuZCBuZXR3b3JraW5nIGFuZCBjb21iaW5lIHdpdGggbmV3IGlubm92YXRpb25zIGluIHNvZnR3YXJlLiBUaGVzZSB3aWxsIHJlY29tYmluZSBpbiBudW1lcm91cyB3YXlzIHRvIGNyZWF0ZSBtdWNoIG1vcmUgY2FwYWJsZSBpbmZyYXN0cnVjdHVyZSBhbmQgYXBwbGljYXRpb24gcGxhdGZvcm1zXFxcIlxcblxcbi1icmlhbiBob3BraW5zIGV0IGFsLiwgZm9ycmVzdGVyIHJlc2VhcmNoLCBmZWJydWFyeSAyMDEzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImJlZmI0MjVhLWUxZGItNGNiZC04NDI1LTc2YTA5ZTNlMDllM1wiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkEzXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJyXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2ltYmxlZG9uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInN1YnRpdGxlXCI6IFwiQSBwcmVtaWVyIHRlbm5pcyBldmVudCBuZWVkZWQgdG8gZGVsaXZlciBpbm5vdmF0aXZlIHdheXMgdG8gc2hhcmUgdGhlIGV4Y2l0ZW1lbnQgb2YgdGhlIHRvdXJuYW1lbnQgYW5kIGVuZ2FnZSBtaWxsaW9ucyBvZiBmYW5zIGdsb2JhbGx5LiBBIHdlYnNpdGUgdGhhdCBsZXZlcmFnZWQgY2xvdWQgd2l0aCBzb2NpYWwgYW5kIG1vYmlsZSBjYXBhYmlsaXRpZXMgd2FzIHRoZSBhbnN3ZXIuXCIsXG4gICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJXaHkgdGhpcyBjbGllbnQgdG9vayBhY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiU29jaWFsIGFuZCBtb2JpbGUgdHJlbmRzIGhhdmUgZHJpdmVuIG5ldyBjdXN0b21lciBleHBlcmllbmNlIGV4cGVjdGF0aW9ucywgcGFydGljdWxhcmx5IGF0IHNwb3J0aW5nIGV2ZW50cy4gRmFpbHVyZSB0byBkZWxpdmVyIGEgc2VhbWxlc3MgaW50ZXJhY3RpdmUgZXhwZXJpZW5jZSBjYW4gbGVhZCB0byBsb3dlciBzYXRpc2ZhY3Rpb24gYW5kIGxvc3Mgb2YgcG90ZW50aWFsIHJldmVudWUuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkJ1c2luZXNzIG91dGNvbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiRm9yIHR3byB3ZWVrcyBldmVyeSB5ZWFyLCAxNyBtaWxsaW9uIHZpc2l0b3JzIGVuam95IGFuIGlubm92YXRpdmUsIGludGVyYWN0aXZlIHdlYiBleHBlcmllbmNlIHRoYXQgc2F0aXNmaWVzIGFuIGluY3JlYXNpbmdseSBzb3BoaXN0aWNhdGVkIGZhbiBiYXNlLlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJSZXF1aXJlbWVudHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiSW4gMjAxMiwgNDAgcGVyY2VudCBvZiB3ZWJzaXRlIHZpc2l0cyB3ZXJlIHZpYSBtb2JpbGUgZGV2aWNlcywgYW5kIGRvd25sb2FkcyBvZiBhIG1vYmlsZSBhcHAgZG91YmxlZCBvdmVyIHRoZSBwcmV2aW91cyB5ZWFyLiBNb2JpbGUgZGVtYW5kcyBhZGRlZCBwcmVzc3VyZSB0byB0aGUgaW5mcmFzdHJ1Y3R1cmUsIHJlcXVpcmluZyBjb250aW51b3VzIGF2YWlsYWJpbGl0eSBhbmQgc2VjdXJpdHksIHdoaWxlIGNvc3QtcGVyLXNpdGUtdmlzaXQgZmlndXJlcyBuZWVkZWQgdG8gZ28gZG93bi5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImJ1dHRvblwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI1NDI0YmI5Yi1jOTI3LTRmYjEtYWUwNi1lNTQ2OTU3Y2JkZmNcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJBM1wiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlNvdXRoIGFtZXJpY2FuIGZpbmFuY2lhbCBvcmdhbml6YXRpb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic3VidGl0bGVcIjogXCJBIGZpbmFuY2lhbCBpbnN0aXR1dGlvbidzIGdyb3d0aCB3YXMgYmVpbmcgaGluZGVyZWQgYnkgaXRzIGluYWJpbGl0eSB0byBxdWlja2x5IGRlbGl2ZXIgYW5kIGxhdW5jaCBuZXcgY2xpZW50IHNlcnZpY2VzIGluIGEgY29tcGV0aXRpdmUgbWFya2V0cGxhY2UuIEl0IG5lZWRlZCBhIHNjYWxhYmxlIGluZnJhc3RydWN0dXJlIHRoYXQgaXQgY291bGQgZWFzaWx5IGFuZCByYXBpZGx5IHByb3Zpc2lvbiB0byBkZWxpdmVyIG5ldyBzZXJ2aWNlcywgc3VjaCBhcyBtb2JpbGUgYmFua2luZyBhcHBzIGFuZCB3ZWItYmFzZWQgc2VsZi1zZXJ2aWNlcy5cIixcbiAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIldoeSB0aGlzIGNsaWVudCB0b29rIGFjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJBbiBpbmVmZmljaWVudCBidXNpbmVzcyBwbGF0Zm9ybSBjYW4ndCBtZWV0IHRoZSBleHBlY3RhdGlvbnMgb2YgbmV3IGN1c3RvbWVycyBsb29raW5nIHRvIGJhbmsgd2hlbiwgd2hlcmUgYW5kIGhvdyB0aGV5IHdhbnQsIHNvIG5laXRoZXIgYmFua2luZyByZXZlbnVlcyBub3IgcHJvZml0cyBncm93LlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJCdXNpbmVzcyBvdXRjb21lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlRocm91Z2ggY2xvdWQgc2VydmljZXMgYW5kIG90aGVyIHRlY2hub2xvZ2llcywgdGhlIGZpbmFuY2lhbCBvcmdhbml6YXRpb24gc3VwcG9ydGVkIGEgNjAwIHBlcmNlbnQgZ3Jvd3RoIHJhdGUgaW4gbW9iaWxlIHRyYW5zYWN0aW9ucyBhbmQgYSAyMDAgcGVyY2VudCB1cHN1cmdlIGluIHdlYiB0cmFuc2FjdGlvbnMgd2hpbGUgc2F2aW5nIHVzZDEuNSBtaWxsaW9uIGluIG9wZXJhdGlvbmFsIGNvc3RzLlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJSZXF1aXJlbWVudHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiVG8gY3JlYXRlIG5ldyBzZXJ2aWNlcyBxdWlja2x5LCBzZXJ2ZXJzIG5lZWRlZCB0byBiZSBwcm92aXNpb25lZCBpbiBzZWNvbmRzLCBhbmQgdGhlIGluZnJhc3RydWN0dXJlIG5lZWRlZCB0byBzY2FsZSByYXBpZGx5LiBUaGUgY2xpZW50IGFsc28gaGFkIHRvIHJlZHVjZSBhZG1pbmlzdHJhdGl2ZSBlZmZvcnQsIGltcHJvdmUgbWFuYWdlYWJpbGl0eSwgbG93ZXIgc29mdHdhcmUgbWFpbnRlbmFuY2UgZXhwZW5zZXMgYW5kIHNpZ25pZmljYW50bHkgcmVkdWNlIGVuZXJneS5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImJ1dHRvblwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJiZmYxZTkyMS03MDlkLTQ3ZDAtYWFjNi0zNDBhZGE2ZWNkNGZcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJBM1wiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJnXCI6IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNvbXB1dGVyIHNlcnZpY2VzIGNvbXBhbnlcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic3VidGl0bGVcIjogXCJBIGV1cm9wZWFuIGNvbXB1dGVyIHNlcnZpY2VzIGNvbXBhbnkgbmVlZGVkIGEgY2xvdWQgc3RvcmFnZSBzZXJ2aWNlIHRoYXQgY291bGQgaGVscCBkaWZmZXJlbnRpYXRlIGl0IGluIHRoZSBtYXJrZXRwbGFjZSBhbmQgYWRkIHZhbHVlIHRvIGl0cyBwb3J0Zm9saW8uIFRoZSBidXNpbmVzcyBuZWVkZWQgYSBsb3ctY29zdCwgc2NhbGFibGUgaW5mcmFzdHJ1Y3R1cmUgdG8gc3VwcG9ydCB0aGlzIHZhbHVhYmxlIG5ldyBvZmZlcmluZyBhbmQgZW5hYmxlIGN1c3RvbWVycyB0byBzaGFyZSBhbmQgc3luY2hyb25pemUgZGF0YSBpbiBhIHNlY3VyZSBhbmQgY29udmVuaWVudCB3YXkuXCIsXG4gICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJXaHkgdGhpcyBjbGllbnQgdG9vayBhY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiU2VsZi1zZXJ2aWNlIGNhcGFiaWxpdGllcyBoaW5nZSBvbiBhIHJlc3BvbnNpdmUgaW5mcmFzdHJ1Y3R1cmU7IHNsb3cgcGVyZm9ybWFuY2UgY2FuIG5lZ2F0aXZlbHkgYWZmZWN0IHRoZSB1c2VyIGV4cGVyaWVuY2UgYW5kIGN1c3RvbWVyIHNhdGlzZmFjdGlvbi5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiQnVzaW5lc3Mgb3V0Y29tZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJJbiBsZXNzIHRoYW4gdHdvIG1vbnRocywgdGhlIGNvbXBhbnkgbGF1bmNoZWQgYW4gaW5ub3ZhdGl2ZSBjbG91ZCBzdG9yYWdlIHNlcnZpY2Ugd2l0aCBmYXIgbG93ZXIgIGVuZXJneSBjb3N0cyBwZXIgcGV0YWJ5dGUgdGhhbiB0aGV5IGhhZCBhY2hpZXZlZCBwcmV2aW91c2x5LlxcblxcbkN1c3RvbWVycyBjYW4gdXNlIHNlbGYtc2VydmljZSBjYXBhYmlsaXRpZXMgdG8gcHJvdmlzaW9uIHN0b3JhZ2Ugc2VydmVycyBpbiBqdXN0IDMwIHNlY29uZHMgYW5kIGFjY2VzcyBmaWxlcyBpbiBvbmx5IDE1IHNlY29uZHMuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlJlcXVpcmVtZW50c1wiLFxuICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJUaGVzZSBjYXBhYmlsaXRpZXMgcmVxdWlyZSBhIHNjYWxhYmxlLCBzZWN1cml0eS1yaWNoIGluZnJhc3RydWN0dXJlIHRoYXQgaXMgZWFzeSBhbmQgY29zdC1lZmZlY3RpdmUgdG8gbWFuYWdlIGFuZCB0aGF0IHN1cHBvcnRzIGdyYW51bGFyIGJpbGxpbmcuXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJidXR0b25cIjogbnVsbFxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImlkXCI6IFwiZThiMGJlN2ItZWViYy00YTRjLTk4MjQtYTc4MjM4OTQ3ZWRhXCIsXG4gICAgXCJudW1iZXJcIjogXCIxMlwiLFxuICAgIFwidGl0bGVcIjogXCJUaGUgc3lzdGVtIGNob2ljZXNcIixcbiAgICBcInBhZ2VzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjY1NGViZjdiLTZiMmEtNDM0NC1iNWRlLTdiMDA5MjgxYTIwMVwiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkkxXCIsXG4gICAgICAgICAgICBcImJvZHlcIjogXCJFeHBsb3JlIGhvdyBpYm0gZGVsaXZlcnMga2V5IGluZnJhc3RydWN0dXJlIGNoYXJhY3RlcmlzdGljcyBhbmQgY3JlYXRlcyBuZXcgdmFsdWUuXCIsXG4gICAgICAgICAgICBcImJhY2tncm91bmRcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwiaW1hZ2UuanBnXCIsXG4gICAgICAgICAgICAgICAgXCJ1cmxAMnhcIjogXCJpbWFnZUAyeC5qcGdcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiNjYwMTIxODEtMTBhYy00YjE5LTk1YmEtY2IxNWJiM2FkYjBkXCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiTTNcIixcbiAgICAgICAgICAgIFwiYm9keVwiOiBcIlRvZGF5J3MgaW5kdXN0cnkgbGVhZGVycyBuZWVkIHRvIGJlIGFybWVkIHdpdGggdGhlIHJpZ2h0IGluZnJhc3RydWN0dXJlIHRvIGFkZHJlc3MgdGhlIGV2ZXItY2hhbmdpbmcgbmVlZHMgYW5kIGV4cGVjdGF0aW9ucyBvZiB0aGVpciBjdXN0b21lcnMgYW5kIG9yZ2FuaXphdGlvbnMuIFRvIGNsYWltIGxlYWRlcnNoaXAsIHRoZWlyIGl0IHN5c3RlbXMgbmVlZCB0byBkZW1vbnN0cmF0ZSB0aGUgcmlnaHQgY2hhcmFjdGVyaXN0aWNzLiBFeHBsb3JlIGhvdyBpYm0gY2FuIGhlbHAuXCIsXG4gICAgICAgICAgICBcImJ1dHRvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlJlc2lsaWVuY3kgbWF0dGVyc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiZTZhYzBhYmItMWRjOC00ZGJlLWE3MTQtN2U0MWY1NWJkNzliXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiUmVzaWxpZW5jeSBtYXR0ZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJBIGR5bmFtaWMsIHJlc3BvbnNpdmUsIHNlY3VyaXR5LXJpY2ggaW5mcmFzdHJ1Y3R1cmUgdGhhdCByYXBpZGx5IHNjYWxlcyB1cCBhbmQgZG93blwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiSG93IGlibSBkZWxpdmVycyBvbiByZXNpbGllbmN5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkFkdmFuY2VkIG1lbW9yeSB1dGlsaXphdGlvbiBhbmQgY2FjaGluZyBvZmZlciBuZWFyLWxpbmVhciBzY2FsYWJpbGl0eSAoc2NhbGUgdXAgdG8gMTAwLDAwMCB2aXJ0dWFsIG1hY2hpbmVzIG9uIGEgc2luZ2xlIHN5c3RlbSkuIFJlc291cmNlIG1hbmFnZW1lbnQgYWNyb3NzIHBoeXNpY2FsIGFuZCB2aXJ0dWFsIGluZnJhc3RydWN0dXJlcyBjYW4gc2NhbGUgaW4gYWNjb3JkYW5jZSB3aXRoIGJ1c2luZXNzIG5lZWRzLiBSb2J1c3Qgc2VjdXJpdHkgZ292ZXJuYW5jZSB0b29scyBhbmQgYXVkaXQgcHJvY2Vzc2VzIGhlbHAgcmVkdWNlIHJpc2suXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRoZSB2YWx1ZSB0byB0aGUgY2lvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkEgcmljaCwgaW50ZXJhY3RpdmUgZXhwZXJpZW5jZSBjYW4gaW5jcmVhc2UgcmV2ZW51ZSBhbmQgdXNlciBzYXRpc2ZhY3Rpb24uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkVmZmljaWVuY3kgbWF0dGVyc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiODdmOTFlOGEtYzAzYS00MzUwLTg0ODktMGUxZmRkNTRiMTFiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiRWZmaWNpZW5jeSBtYXR0ZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJFZmZlY3RpdmUgdXRpbGl6YXRpb24gb2YgaXQgaW5mcmFzdHJ1Y3R1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkhvdyBpYm0gZGVsaXZlcnMgb24gZWZmaWNpZW5jeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJJbnRlZ3JhdGVkIG1hbmFnZW1lbnQgYW5kIGF1dG9tYXRpb24gaGVscCBzaW1wbGlmeSBpdCBtYW5hZ2VtZW50LCByZWR1Y2UgYWRtaW5pc3RyYXRpdmUgdGltZSBhbmQgaW1wcm92ZSBlZmZpY2llbmN5IHdoaWxlIHJlZHVjaW5nIGNvc3RzLiBSZXBlYXRhYmxlLCBwcm92ZW4gcGF0dGVybnMgb2YgZXhwZXJ0aXNlIGNhbiBtb3JlIHF1aWNrbHkgYnVpbGQgaW5ub3ZhdGl2ZSBzb2x1dGlvbnMgd2l0aCBsb2dpY2FsIHJlcHJlc2VudGF0aW9ucyBvZiByZWN1cnJpbmcgdG9wb2xvZ2llcyBmb3IgZ2l2ZW4gcmVxdWlyZW1lbnRzLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGUgdmFsdWUgdG8gdGhlIGNpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJOZXcgY2xpZW50IHNlcnZpY2VzIGFyZSByYXBpZGx5IGRldmVsb3BlZCwgd2hpbGUgb3BlcmF0aW9uYWwgY29zdHMgZGVjcmVhc2UuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlJlc3BvbnNpdmVuZXNzIG1hdHRlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjYzYTM2MGI3LTk1ZmItNGZiYy1iMDUxLTdjNWY0OTNiZjU2NlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlJlc3BvbnNpdmVuZXNzIG1hdHRlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkFuIGludGVncmF0ZWQsIG1vZHVsYXIgaW5mcmFzdHJ1Y3R1cmUgdGhhdCBpcyByYXBpZGx5IGRlcGxveWFibGUgYW5kIGhpZ2hseSBzY2FsYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiSG93IGlibSBkZWxpdmVycyBvbiByZXNwb25zaXZlbmVzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJBIGRlZXBseSBpbnRlZ3JhdGVkIGNvbXB1dGluZywgc3RvcmFnZSBhbmQgbmV0d29ya2luZyBzeXN0ZW0gY2FuIHJhcGlkbHkgZGVwbG95IGNsb3VkIHNlcnZpY2VzIGluIG1pbnV0ZXMgaW5zdGVhZCBvZiBkYXlzLiBBbiBpbnRlZ3JhdGVkIHNldCBvZiBjYXBhYmlsaXRpZXMgaGVscHMgYnVpbGQgc2VjdXJpdHktcmljaCBwcml2YXRlIGNsb3VkcyBhbmQgY2xvdWQgZGVsaXZlcnkgcGxhdGZvcm1zIGZvciBtYW5hZ2VkIHNlcnZpY2UgcHJvdmlkZXJzLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGUgdmFsdWUgdG8gdGhlIGNpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJBIGNvc3QtY29tcGV0aXRpdmUsIGhpZ2hseSByZXNwb25zaXZlIHNvbHV0aW9uIGlzIHF1aWNrbHkgYnJvdWdodCB0byB0aGUgbWFya2V0cGxhY2UuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiaWRcIjogXCJlOWRkYWFkMy04M2M2LTQ2NjItYTQ2MS00YmU3MGQ3NjU4NDZcIixcbiAgICBcIm51bWJlclwiOiBcIjAzXCIsXG4gICAgXCJ0aXRsZVwiOiBcIlRocmVlIG11c3QtcmVhZHNcIixcbiAgICBcInBhZ2VzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjFmNzE2ZjkwLTA1YzktNDZmMC05ZjYwLWRkNmI3YWIzNGNjOVwiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkkxXCIsXG4gICAgICAgICAgICBcImJvZHlcIjogXCJBIHBvd2VyZnVsIHdheSB0byBpbmNyZWFzZSB0aGUgY29sbGVjdGl2ZSBleHBlcnRpc2VcIixcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJpbWFnZS5qcGdcIixcbiAgICAgICAgICAgICAgICBcInVybEAyeFwiOiBcImltYWdlQDJ4LmpwZ1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI3YmIyNWI4Yi1mY2VlLTQ4ZjktOTFiMS1hZDEyMGMyOTRkMGNcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJNNlwiLFxuICAgICAgICAgICAgXCJsaW5rc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiZmIyNGEzYTEtZmQ1MC00NmQzLTllZTEtNjA4NTY5ZmNmYTgwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlRoZSBwb3dlciBvZiBjbG91ZDogRHJpdmluZyBidXNpbmVzcyBtb2RlbCBpbm5vdmF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJjZGQ5NWNhNC1hOGI4LTRhMjUtODQyNy05MTY3NWE0YWRjOTlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGUgcG93ZXIgb2YgY2xvdWQ6IERyaXZpbmcgYnVzaW5lc3MgbW9kZWwgaW5ub3ZhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiVGhlIElCTSBJbnN0aXR1dGUgZm9yIEJ1c2luZXNzIFZhbHVlLCB0aHJvdWdoIGEgc3VydmV5IGNvbmR1Y3RlZCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoZSBFY29ub21pc3QgSW50ZWxsaWdlbmNlIFVuaXQsIGRpc2NvdmVycyBob3cgZ2xvYmFsIGJ1c2luZXNzIGFuZCB0ZWNobm9sb2d5IGV4ZWN1dGl2ZXMgc2VlIHRoZSBnYW1lLWNoYW5naW5nIHBvdGVudGlhbCBvZiBjbG91ZC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSUJNIEluc3RpdHV0ZSBmb3IgQnVzaW5lc3MgVmFsdWUgZXhlY3V0aXZlIHJlcG9ydCwgRmVicnVhcnkgMjAxMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IFwiaHR0cDovL3d3dy05MzUuaWJtLmNvbS9zZXJ2aWNlcy91cy9nYnMvdGhvdWdodGxlYWRlcnNoaXAvaWJ2LXBvd2VyLW9mLWNsb3VkLmh0bWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJkMjRkNmNiOC1mZWFkLTQ4NGItYjJhYy0yYzlhZWQ4MzJjN2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXFxcIkhvdyBDbG91ZCBDb21wdXRpbmcgSXMgQ2hhbmdpbmcgSVQgT3JnYW5pemF0aW9uc1xcXCJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjNiYTVmNzllLTkyZjAtNDZkMi05YWEzLTc0NzIyM2JhNjkzMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPNlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlxcXCJIb3cgQ2xvdWQgQ29tcHV0aW5nIElzIENoYW5naW5nIElUIE9yZ2FuaXphdGlvbnNcXFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJJbiBpbnZlc3RpZ2F0aW5nIHRoZSBlZmZlY3Qgb2YgY2xvdWQgb24gY29ycG9yYXRlIElUIGRlcGFydG1lbnRzLCBEZWxvaXR0ZSBJbnNpZ2h0cyBmb3VuZCBhIG1ham9yIHNoaWZ0IGluIHRoZSByZXNwb25zaWJpbGl0aWVzIG9mIElUIHByb2Zlc3Npb25hbHMsIGluY2x1ZGluZyB0aGUgYWJpbGl0eSB0byBmb2N1cyBvbiBoaWdoLXZhbHVlIGFjdGl2aXRpZXMgdGhhdCBlbmFibGUgbmV3IGluc2lnaHRzIGFuZCBpbm5vdmF0aW9uLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDSU8gSm91cm5hbCDigJMgRGVsb2l0dGUgSW5zaWdodHMsIEFwcmlsIDI5LCAyMDEzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjogXCJodHRwOi8vZGVsb2l0dGUud3NqLmNvbS9jaW8vMjAxMy8wNC8yOS9ob3ctY2xvdWQtY29tcHV0aW5nLWlzLWNoYW5naW5nLWl0LW9yZ2FuaXphdGlvbnMvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiNmNjOTU3ZTctMmUwZi00M2JlLWE0YTYtZGJkZTJiNTc3ZTQ4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkVtYnJhY2UgdGhlIEluZXZpdGFibGU6IFNpeCBJbXBlcmF0aXZlcyB0byBQcmVwYXJlIFlvdXIgQ29tcGFueSBmb3IgQ2xvdWQgQ29tcHV0aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJlMzc5ZmNmMS02MzExLTRkMTItYjRiYy04N2QzOWRmODRkY2FcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJFbWJyYWNlIHRoZSBJbmV2aXRhYmxlOiBTaXggSW1wZXJhdGl2ZXMgdG8gUHJlcGFyZSBZb3VyIENvbXBhbnkgZm9yIENsb3VkIENvbXB1dGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiSW4gcmV2aWV3aW5nIGNsb3VkIGFkb3B0aW9uIGF0IDQ2IGxlYWRpbmcgY29tcGFuaWVzLCB0aGUgTUlUIENlbnRlciBmb3IgSW5mb3JtYXRpb24gU3lzdGVtcyBSZXNlYXJjaCAoQ0lTUikgZXhwbG9yZXMgdGhlIHNpeCBjcml0aWNhbCBmYWN0b3JzIHlvdXIgY29tcGFueSBuZWVkcyB0byBpbXBsZW1lbnQgdG8gbWF4aW1pemUgdGhlIGJlbmVmaXRzIG9mIGNsb3VkIGNvbXB1dGluZy5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiTUlUIFNsb2FuIE1hbmFnZW1lbnQgQ0lTUiByZXNlYXJjaCBicmllZmluZywgT2N0b2JlciAxOCwgMjAxMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IFwiaHR0cDovL2Npc3IubWl0LmVkdS9ibG9nL2RvY3VtZW50cy8yMDEyLzEwLzE4LzIwMTJfMTAwMV9lbWJyYWNlaW5ldml0YWJsZV9tb29uZXlyb3NzcGhpcHBzLXBkZi9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImlkXCI6IFwiZmI0YTllMTctNjY2NS00ZDQ4LWE5NjQtYTgyYzUwY2RlNDdhXCIsXG4gICAgXCJudW1iZXJcIjogXCIxMFwiLFxuICAgIFwidGl0bGVcIjogXCJUaGUgbmV3IHZvY2FidWxhcnlcIixcbiAgICBcInBhZ2VzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjcyNmEzNjc5LWRhZTgtNDQ3Yi1iZjAyLTkxOTQxMTRmN2MxMFwiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkkxXCIsXG4gICAgICAgICAgICBcImJvZHlcIjogXCJNYXN0ZXIgdGhlIHRlcm1pbm9sb2d5IHNvIHlvdSBjYW4gZnJhbWUgdGhlIGNvbnZlcnNhdGlvbi5cIixcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJpbWFnZS5qcGdcIixcbiAgICAgICAgICAgICAgICBcInVybEAyeFwiOiBcImltYWdlQDJ4LmpwZ1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJiOTg2NjBmYy0xZjc0LTQ1ZDAtOTE2Yi00ZDY0NzcyOTkyODJcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJNN1wiLFxuICAgICAgICAgICAgXCJsaW5rc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiYWQ2YTJhOTAtMzliMi00NDQ1LTkzMTctYzhmMGUyZDkyOTYyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNsb3VkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI5YTA5MjFlNS0yN2MwLTRjYTgtYmUzZS03MGQyN2JlZjJkM2FcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJDbG91ZDpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkNsb3VkIGNvbXB1dGluZyBpcyBhIG1vZGVsIGZvciBlbmFibGluZyB1YmlxdWl0b3VzLCBjb252ZW5pZW50IG5ldHdvcmsgYWNjZXNzIG9uIGRlbWFuZCB0byBhIHNoYXJlZCBwb29sIG9mIGNvbmZpZ3VyYWJsZSBjb21wdXRpbmcgcmVzb3VyY2VzLiBDbG91ZCB0ZWNobm9sb2d5IGNhbiBiZSByYXBpZGx5IHByb3Zpc2lvbmVkIGFuZCByZWxlYXNlZCB3aXRoIG1pbmltYWwgbWFuYWdlbWVudCBlZmZvcnQgb3Igc2VydmljZSBwcm92aWRlciBpbnRlcmFjdGlvbi5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJmMjFiMjlmYi0wNTYyLTQ5MzUtYWEyZC1jNzkyMzc0MTJiY2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUHJpdmF0ZSBjbG91ZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiMzhmMWFiNzMtODM1NS00NTA5LTg0N2YtMDlkYzRhODM1MzY1XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiUHJpdmF0ZSBjbG91ZDpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIkEgcHJpdmF0ZSBjbG91ZCBpcyBvZmZlcmVkIG92ZXIgdGhlIEludGVybmV0IG9yIG92ZXIgYSBwcml2YXRlIGludGVybmFsIG5ldHdvcmsgdG8gc2VsZWN0IHVzZXJzOyBpdCBpcyBub3QgYXZhaWxhYmxlIHRvIHRoZSBnZW5lcmFsIHB1YmxpYy4gVGhpcyBwcm92aWRlcyBncmVhdGVyIGNob2ljZSBhbmQgY29udHJvbCBmb3IgZW50ZXJwcmlzZXMsIGVzcGVjaWFsbHkgZm9yIHN1cHBvcnRpbmcgbWlzc2lvbi1jcml0aWNhbCBhcHBsaWNhdGlvbnMuXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiYmIyMWVjMTUtOWZkYy00ODZjLWI1YWEtNjY4ZTAzZjk3Y2Y5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlB1YmxpYyBjbG91ZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiODUxYzk5YjQtMWE4Yy00MWFiLWIxYTgtOWNmYWI5MjYxYTMxXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiUHVibGljIGNsb3VkOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiUHVibGljIGNsb3VkIGlzIG9mZmVyZWQgb3ZlciB0aGUgcHVibGljIEludGVybmV0IGFuZCBhdmFpbGFibGUgdG8gYW55b25lIHdobyB3YW50cyB0byBwdXJjaGFzZSB0aGUgc2VydmljZS4gSXQgaXMgY2hhcmFjdGVyaXplZCBieSByYXBpZCBwcm92aXNpb25pbmcsIHBheS1hcy15b3UtZ28gcHJpY2luZywgYW5kIGhpZ2ggbGV2ZWxzIG9mIHNjYWxhYmlsaXR5IGFuZCBmbGV4aWJpbGl0eS5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI3YjJhZDQ2Zi02MzA3LTQ0MTMtYWRmNi1hNzhlYWVlMWM4ZDdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSHlicmlkIGNsb3VkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI0NDc0NWI2ZC1hZjlhLTRjNDItOGFiOS0zMzdmYmFkOWI2YjRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJIeWJyaWQgY2xvdWQ6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJIeWJyaWQgY2xvdWQgcmVwcmVzZW50cyBhIGNvbWJpbmF0aW9uIG9mIG11bHRpcGxlIGRlbGl2ZXJ5IG1vZGVscywgcG90ZW50aWFsbHkgaW5jbHVkaW5nIHB1YmxpYyBjbG91ZCwgcHJpdmF0ZSBjbG91ZCBhbmQgdHJhZGl0aW9uYWwgb24tcHJlbWlzZXMgbW9kZWxzLiBJdCBpcyBvbmUgb2YgdGhlIG1vc3QgY29tbW9uIGNsb3VkIG1vZGVscyBmb3IgbW9zdCBlbnRlcnByaXNlcyBiZWNhdXNlIHRoZWlyIGRpZmZlcmVudCB3b3JrbG9hZHMgYXJlIGJlc3Qgc3VpdGVkIGZvciBkaWZmZXJlbnQgZGVsaXZlcnkgbW9kZWxzLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjI5MDdiNWM4LTUwY2ItNDdhNy05YzlmLWZjZjRkNmE4OTg1ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJbmZyYXN0cnVjdHVyZSBhcyBhIHNlcnZpY2UgKElhYVMpXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI4NjU1YmE5Zi1lNzE2LTQzMTUtODZjZS1hZmU2MDEyYWQwYjZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJJbmZyYXN0cnVjdHVyZSBhcyBhIHNlcnZpY2UgKElhYVMpOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiSWFhUyBpcyBhIGNsb3VkIGluZnJhc3RydWN0dXJlIHNlcnZpY2Ugd2hlcmUgYSB2aXJ0dWFsaXplZCBlbnZpcm9ubWVudCBpcyBkZWxpdmVyZWQgYXMgYSBzZXJ2aWNlIG92ZXIgdGhlIEludGVybmV0IGJ5IHRoZSBwcm92aWRlci4gVGhlIGluZnJhc3RydWN0dXJlIGNhbiBpbmNsdWRlIHNlcnZlcnMsIG5ldHdvcmsgZXF1aXBtZW50IGFuZCBzb2Z0d2FyZS5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCIxOTVkOGU0YS0xMzcxLTQ3ZGEtYWEwNS0wOTI4Y2Q5M2EyYzNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUGxhdGZvcm0gYXMgYSBzZXJ2aWNlIChQYWFTKVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiOGFkMzhiYTktYmFhZC00OWJhLWJhNjAtYzFlZjFmNWMxNjIzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiUGxhdGZvcm0gYXMgYSBzZXJ2aWNlIChQYWFTKTpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlBhYVMgaXMgYSBjbG91ZCBwbGF0Zm9ybSBzZXJ2aWNlIHdoZXJlIHRoZSBjb21wdXRpbmcgcGxhdGZvcm0gKG9wZXJhdGluZyBzeXN0ZW0gYW5kIGFzc29jaWF0ZWQgc2VydmljZXMpIGlzIGRlbGl2ZXJlZCBhcyBhIHNlcnZpY2Ugb3ZlciB0aGUgSW50ZXJuZXQgYnkgdGhlIHByb3ZpZGVyLiBDbG91ZCBwbGF0Zm9ybSBzZXJ2aWNlcyBzdXBwb3J0IGRldmVsb3BtZW50LCBkZXBsb3ltZW50LCBtYW5hZ2VtZW50IGFuZCBpbnRlZ3JhdGlvbiBvZiBhcHBsaWNhdGlvbnMuXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiYzY4NDExMzAtMTkzZC00M2Q1LTg4YzItYWRkODVkNGYwNjBhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlNvZnR3YXJlIGFzIGEgc2VydmljZSAoU2FhUylcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjdhNTI4ZWUzLTU5NjMtNDAwMy04ODhjLWM5MDM1NTFkMzY0MFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlNvZnR3YXJlIGFzIGEgc2VydmljZSAoU2FhUyk6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJTYWFTIGlzIGEgY2xvdWQgYXBwbGljYXRpb24gc2VydmljZSB3aGVyZSBhcHBsaWNhdGlvbnMgYXJlIGRlbGl2ZXJlZCBvdmVyIHRoZSBJbnRlcm5ldCBieSB0aGUgcHJvdmlkZXIuIFRoaXMgbWVhbnMgdGhhdCB0aGUgYXBwbGljYXRpb25zIGRvbuKAmXQgaGF2ZSB0byBiZSBwdXJjaGFzZWQsIGluc3RhbGxlZCBhbmQgcnVuIG9uIHRoZSBjdXN0b21lcuKAmXMgY29tcHV0ZXJzLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjRkNDljMjViLWJkN2MtNGVhNS1iZjFkLTA1N2NlNzFlZjZiZlwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCdXNpbmVzcyBwcm9jZXNzIGFzIGEgc2VydmljZSAoQlBhYVMpXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJkYmNmZTc2Mi02ZGJkLTQwNjUtOTVlOS0xZWRlNzY1NzA4YjJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJCdXNpbmVzcyBwcm9jZXNzIGFzIGEgc2VydmljZSAoQlBhYVMpOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiQlBhYVMgaXMgYSBjbG91ZCBwbGF0Zm9ybSBzZXJ2aWNlIHdoZXJlIGEgY29tcGxldGUgYnVzaW5lc3MgcHJvY2VzcyBpcyBwcm92aWRlZCBhcyBhIHNlcnZpY2UuIFRoaXMgY2FuIGluY2x1ZGUgYSB3aWRlIHJhbmdlIG9mIGZ1bmN0aW9ucyBhY3Jvc3MgYW4gZW50ZXJwcmlzZSwgaW5jbHVkaW5nIGJpbGxpbmcsIEhSLCBwYXlyb2xsIGFuZCBhZHZlcnRpc2luZy5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJkNTFhYWRlYy1hOTY0LTRhNGMtODg5NS1mZTVlMGQ1Y2ZmZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ2hpZWYgY2xvdWQgb2ZmaWNlciAoQ0NPKVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiZTNjMWY0NDYtYmU4Yy00MjUxLWJiODUtZTM0ZGVlNTQ5MWFkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiUE8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiQ2hpZWYgY2xvdWQgb2ZmaWNlciAoQ0NPKTpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9keVwiOiBcIlRoZSBDQ08gaXMgYW4gb2ZmaWNlciB3aG8gaXMgcmVzcG9uc2libGUgZm9yIHBsYW5uaW5nLCBtb25pdG9yaW5nIGFuZCBldmFsdWF0aW5nIHRoZSB1c2Ugb2YgdGhlIGNsb3VkIHdpdGggYSBjb21wYW55d2lkZSBwZXJzcGVjdGl2ZSBiZXlvbmQgdGhlIHdhbGxzIG9mIHRoZSBJVCBhbmQgYnVzaW5lc3MuIEFzIGNsb3VkIGNvbXB1dGluZyBiZWNvbWVzIG1vcmUgd2lkZWx5IHVzZWQsIHRoaXMgcm9sZSB3aWxsIGJlIHJlcXVpcmVkIGFuZCByZWNvZ25pemVkIGJ5IG1hbnkgZW50ZXJwcmlzZXMuXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiZDhlZWM1YWItMTczZi00NzYwLTk5ZDktYjk4Y2QxZjA0Yjg1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNsb3VkLWNlbnRyaWMgd29ya2xvYWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjkwZGI5MThkLTE1YmItNDgxZS05MDY5LTE0YzQwZWFhYmEyZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkNsb3VkLWNlbnRyaWMgd29ya2xvYWQ6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogXCJDcmVhdGVkIHNwZWNpZmljYWxseSBmb3IgdGhlIGNsb3VkLCBhIGNsb3VkLWNlbnRyaWMgd29ya2xvYWQgdHlwaWNhbGx5IGxldmVyYWdlcyBjbG91ZC1iYXNlZCBjYXBhYmlsaXRpZXMgc3VjaCBhcyBtdWx0aXRlbmFuY3kgYW5kIGF1dG9tYXRpYywgZWxhc3RpYyBzY2FsaW5nIGFuZCB3b3JrbG9hZCBwb3J0YWJpbGl0eS4gVGhlc2UgaW5ub3ZhdGl2ZSB0ZWNobm9sb2dpZXMgYW5kIHByb2Nlc3NlcyBlbmFibGUgY3VzdG9tZXJzIHRvIHN0YXJ0IG5ldyBzZXJ2aWNlcyBxdWlja2x5LlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImY5NjI3OGZmLWY1ODgtNDA4Ni04N2RhLWIwMTU5ODc3NTg4M1wiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDbG91ZC1lbmFibGVkIHdvcmtsb2FkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI5Y2MyNjg0MC0xY2Q2LTQwNDItOGY5My1mMTM2NmZhMjhmYWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJQTzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJDbG91ZC1lbmFibGVkIHdvcmtsb2FkOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiQ2xvdWQtZW5hYmxlZCB3b3JrbG9hZHMgYXJlIGRlcGxveWVkIHdpdGggYXBwbGljYXRpb25zIG9yaWdpbmFsbHkgZGVzaWduZWQgZm9yIHByZWNsb3VkIGVudmlyb25tZW50cy4gV2hpbGUgYXBwbGljYXRpb24gYXJjaGl0ZWN0dXJlIG9mdGVuIGRpY3RhdGVzIHBsYXRmb3JtIHJlcXVpcmVtZW50cywgY2xvdWQgYWRhcHRhdGlvbiBhc3Nlc3NtZW50cyBhbmQgb3B0aW1pemVkIG1pZ3JhdGlvbiBwcm9qZWN0cyBoZWxwIGN1dCBjdXN0b21lcnPigJkgSVQgcmVzb3VyY2UgYW5kIG9wZXJhdGluZyBjb3N0cy5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCIyODRkNjEzZS00NTBmLTQwMDktODk2ZS1kM2QwMTVjZjZmODdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRGV2T3BzIG9uIFBhYVNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjFkNjFiZmUxLTI2MzEtNDJmZi04Mzg5LTFhMTE4ZGQ2MmFkMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIlBPMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkRldk9wcyBvbiBQYWFTOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IFwiSW50ZWdyYXRlZCB0b29scyBhbmQgUGFhUyBjb21lIHRvZ2V0aGVyIHRvIHByb3ZpZGUgdGhlIHBvcnRhYmlsaXR5IG9mIHdvcmtsb2FkIHZpYSBoeWJyaWQgY2xvdWQsIG1ha2luZyBhZ2lsZSBhbmQgZWxhc3RpYyBEZXZPcHMgZW52aXJvbm1lbnRzIHBvc3NpYmxlLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gIHJlcXVpcmUoJy4vMGFmMTc5NjAtZGI3YS00NTUxLWE2ZjAtZTZlZDUxNDVkOWU4Lmpzb24nKSxcbiAgcmVxdWlyZSgnLi85NTAxNzk1My1jY2E0LTRkMTEtYWNiOC0xM2VjNWQ2NTdjZGUuanNvbicpLFxuICByZXF1aXJlKCcuL2NjYWI3YzZlLWVjMTUtNDFkMS1hYmNmLTJmNGE5M2MxZWRlOS5qc29uJyksXG4gIHJlcXVpcmUoJy4vZThiMGJlN2ItZWViYy00YTRjLTk4MjQtYTc4MjM4OTQ3ZWRhLmpzb24nKSxcbiAgcmVxdWlyZSgnLi9lOWRkYWFkMy04M2M2LTQ2NjItYTQ2MS00YmU3MGQ3NjU4NDYuanNvbicpLFxuICByZXF1aXJlKCcuL2ZiNGE5ZTE3LTY2NjUtNGQ0OC1hOTY0LWE4MmM1MGNkZTQ3YS5qc29uJylcbl0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgJ2NhYzJiMjdjLWZhMDAtNDAwZC1hNjQ0LWJhNjQwOGIyNTY2ZCc6IHtcbiAgICBlZGl0aW9uOiByZXF1aXJlKCcuL2NhYzJiMjdjLWZhMDAtNDAwZC1hNjQ0LWJhNjQwOGIyNTY2ZC5qc29uJyksXG4gICAgY29udGFpbmVyczogcmVxdWlyZSgnLi9jYWMyYjI3Yy1mYTAwLTQwMGQtYTY0NC1iYTY0MDhiMjU2NmQvY29udGFpbmVycycpXG4gIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgZWRpdGlvbnM6IHJlcXVpcmUoJy4vZWRpdGlvbnMvJylcbn0iLCJ2YXIgJCA9IHJlcXVpcmUoJ2pRdWVyeScpO1xudmFyIEZhc3RDbGljayA9IHJlcXVpcmUoJ2Zhc3RjbGljaycpO1xuXG5cblxuLyoqXG5cbiAgSUJNIEVNIFVJXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gICovXG5cblxuLypcbkluIHRoaXMgYXBwLCBhbGwgbWVhc3VyZW1lbnRzIGFyZSBpbiByZW0gdW5pdHMgd2hlbiBwb3NzaWJsZVxuYW5kIHJlbGF0ZSB0byB0aGUgSFRNTCBlbGVtZW50LiAgVGhlIEhUTUwgZWxlbWVudCBoYXMgYVxubWluaW11bSBmb250LXNpemUgb2YgNjIuNSUgYXQgNzY4cHggdmlld3BvcnQgd2lkdGguICBUaGVcbmZvbnQtc2l6ZSB2YWx1ZSB3aWxsIHJlc3BvbmQgYXMgdGhlIHZpZXdwb3J0J3Mgd2lkdGhcbnJlc2l6ZXMuIEluIGVmZmVjdCwgaXQgcmVzaXplcyBldmVyeXRoaW5nIHRoYXQgdXNlcyByZW0gdW5pdHMsXG5hbmQgc2luY2UgdGhlIGltYWdlcyBhcmUgc2V0IHRvIGJlIDEwMCUgd2lkdGgsIHRoZSByZXN1bHQgaXMgYVxubmljZSByZXNwb25zaXZlIGV4cGVyaWVuY2Ugd2hlcmUgaXQgYWxtb3N0IGFwcGVhcnMgdGhhdCB0aGUgc2l0ZVxuem9vbXMgaW4gYW5kIG91dCwgYXMgb3Bwb3NlZCB0byBmbGV4aW5nIGNvbnRlbnQgdG8gdGhlIHZpZXdwb3J0LlxuKi9cblxuZnVuY3Rpb24gem9vbUJhc2VGb250U2l6ZSgpe1xuICAvLyA3NjggLyA2Mi41ID0gMTIuMjg4OCB0aGlzIGlzIG91ciB6b29tIGNvZWZpY2llbnRcbiAgdmFyICR3aW4gPSAkKHdpbmRvdyksXG4gICAgICBtYXhXaWR0aCA9IDc2ODtcbiAgICAgIG1pbldpZHRoID0gMzIwLFxuICAgICAgZm9udFNpemVBdE1pbldpZHRoID0gMTAwLFxuICAgICAgem9vbUNvZWZmaWNpZW50ID0gbWluV2lkdGggLyBmb250U2l6ZUF0TWluV2lkdGgsXG4gICAgICBuZXdGb250U2l6ZSA9ICQod2luZG93KS53aWR0aCgpIC8gem9vbUNvZWZmaWNpZW50O1xuICAvLyBab29tIG9mIGxhcmdlciB0aGFuIG1pbldpZHRoXG4gIGlmKCR3aW4ud2lkdGgoKSA+IG1pbldpZHRoICYmICR3aW4ud2lkdGgoKSA8IG1heFdpZHRoICsgMSl7XG4gICAgJChcImh0bWxcIikuY3NzKFwiZm9udC1zaXplXCIsIG5ld0ZvbnRTaXplK1wiJVwiKTtcbiAgfVxuICBlbHNlIHtcbiAgICAkKFwiaHRtbFwiKS5jc3MoXCJmb250LXNpemVcIiwgZm9udFNpemVBdE1pbldpZHRoK1wiJVwiKTtcbiAgfVxuICBpZigkd2luLndpZHRoKCkgPiBtYXhXaWR0aCkge1xuICAgICQoXCJodG1sXCIpLmNzcyhcImZvbnQtc2l6ZVwiLCBcIjEwMCVcIik7XG4gIH1cbn1cbnpvb21CYXNlRm9udFNpemUoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuXG4gIC8vIFJlc2l6aW5nXG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXtcbiAgICB6b29tQmFzZUZvbnRTaXplKCk7XG4gIH0pO1xuXG4gIC8qIEBwYWdpbmdcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAvLyBGaXJzdCBpcyBhbHdheXMgYWN0aXZlXG4gICQoXCIudFwiKS5lcSgwKS5hZGRDbGFzcyhcImlzLWFjdGl2ZVwiKTtcblxuICAvLyBQYWdlcnNcbiAgJChcIi50X19wYWdlclwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgJCh0aGlzKS5wYXJlbnQoXCIudFwiKS5yZW1vdmVDbGFzcyhcImlzLWFjdGl2ZVwiKS5uZXh0KFwiLnRcIikubm90KFwiLm1vZGFsXCIpLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuICAgIGNvbnNvbGUubG9nIChcbiAgICAgICQodGhpcykucGFyZW50KFwiLnRcIikubmV4dChcIi50XCIpLm5vdChcIi5tb2RhbFwiKSxcbiAgICAgICQodGhpcykucGFyZW50KFwiLnRcIikubmV4dChcIi50XCIpLFxuICAgICAgJCh0aGlzKS5wYXJlbnQoXCIudFwiKVxuICAgICk7XG4gIH0pO1xuXG4gIC8vIEJ1dHRvbnMgaW4gQTIgb3BlbiBuZXh0IG1vZGFsXG4gICQoXCIuYTIgLmJ0blwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgJCh0aGlzKS5wYXJlbnRzKFwiLnRcIikubmV4dChcIi5tb2RhbFwiKS5hZGRDbGFzcyhcImlzLWFjdGl2ZVwiKTtcbiAgfSk7XG5cblxuICAvLyBNb2RhbCBjbG9zZVxuICAkKFwiLm1vZGFsX19jbG9zZVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgJCh0aGlzKS5wYXJlbnQoXCIubW9kYWxcIikucmVtb3ZlQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gIH0pO1xuXG5cblxuICAvKiBAZmFzdC1jbGlja1xuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBGYXN0Q2xpY2suYXR0YWNoKGRvY3VtZW50LmJvZHkpO1xuXG5cblxuXG5cbiAgLyogQGFjY29yZGlhbnNcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAkKFwiLmpzLWFjY29yZGlhbi10b2dnbGVcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcbiAgICAvLyBwcmV2ZW50IGRlZmF1bHQgZXZlbnRcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy8gZGVmaW5lIHZhcnNcbiAgICB2YXIgdG9nZ2xlID0gICQodGhpcyksXG4gICAgICAgIHRhcmdldCA9IHRvZ2dsZS5hdHRyKFwiZGF0YS10b2dnbGVcIiksXG4gICAgICAgIHRhcmdldHMgPSAkKFwiLmFjY29yZGlhbi1tZW51X19saW5rW2RhdGEtdG9nZ2xlPSdcIit0YXJnZXQrXCInXVwiKTtcbiAgICAvLyB0b2dnbGUgYWN0aXZlIGNsYXNzZXMgZm9yIHRoaXMgYW5kIG90aGVyIGFjY29yZGlhbiBtZW51IGxpbmtzXG4gICAgJChcIi5hY2NvcmRpYW4tbWVudV9fbGlua1wiKS5yZW1vdmVDbGFzcyhcImlzLWFjdGl2ZVwiKTtcbiAgICB0YXJnZXRzLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuXG4gIH0pO1xuXG5cblxuXG4gIC8qIEB0b2dnbGUtbmF2XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAkKFwiLmpzLXRvZ2dsZS1uYXYgXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG4gICAgLy8gcHJldmVudCBkZWZhdWx0IGV2ZW50XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vIHRvZ2dsZSBhY3RpdmUgbmF2IGNsYXNzZXMgZm9yIHNpdGUgaGVhZGVyIGFuZCBtYWluXG4gICAgJChcIi5zaXRlLWhlYWRlciwgLnNpdGUtbWFpblwiKS50b2dnbGVDbGFzcyhcImlzLWFjdGl2ZS1uYXZcIik7XG4gIH0pO1xuXG5cbiAgJChcIi5zaXRlLW5hdl9fbGlua3MgYVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuICAgIC8vIHVwZGF0ZSBhY3RpdmUgc3RhdGVcbiAgICAkKFwiLnNpdGUtbmF2X19saW5rcyBhXCIpLnJlbW92ZUNsYXNzKFwiaXMtYWN0aXZlXCIpO1xuICAgICQodGhpcykuYWRkQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgLy8gdXBkYXRlIG5hdiB0aXRsZVxuICAgICQoXCIuc2l0ZS1uYXZfX3RpdGxlXCIpLnRleHQoJCh0aGlzKS5maW5kKFwiYlwiKS50ZXh0KCkpO1xuICAgIC8vIHVwZGF0ZSBuYXZcbiAgICAkKFwiLnNpdGUtaGVhZGVyLCAuc2l0ZS1tYWluXCIpLnRvZ2dsZUNsYXNzKFwiaXMtYWN0aXZlLW5hdlwiKTtcbiAgfSk7XG5cblxufTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGFuZGxlYmFycycpO1xuXG5cblxuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdwbycsIGZ1bmN0aW9uKHRlbXBsYXRlLCBjb250ZXh0LCBwYXJlbnRDb250ZXh0LCBvcHRpb25zKXtcbiAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKC9cXC8vZywgJ18nKTtcbiAgdmFyIGYgPSBIYW5kbGViYXJzLnBhcnRpYWxzWydwYWdlcy4nICsgdGVtcGxhdGUudG9Mb3dlckNhc2UoKV07XG4gIGlmICghZikge1xuICAgIHJldHVybiBcIlBhcnRpYWwgbm90IGxvYWRlZFwiO1xuICB9XG5cbiAgY29udGV4dCA9IF8uZXh0ZW5kKGNvbnRleHQsIHtwYXJlbnQ6IHBhcmVudENvbnRleHR9KTtcbiAgcmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcoZihjb250ZXh0KSk7XG59KTsiLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjUuMVxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBFc3RhYmxpc2ggdGhlIG9iamVjdCB0aGF0IGdldHMgcmV0dXJuZWQgdG8gYnJlYWsgb3V0IG9mIGEgbG9vcCBpdGVyYXRpb24uXG4gIHZhciBicmVha2VyID0ge307XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXJcbiAgICBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIGNvbmNhdCAgICAgICAgICAgPSBBcnJheVByb3RvLmNvbmNhdCxcbiAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxuICAgIG5hdGl2ZU1hcCAgICAgICAgICA9IEFycmF5UHJvdG8ubWFwLFxuICAgIG5hdGl2ZVJlZHVjZSAgICAgICA9IEFycmF5UHJvdG8ucmVkdWNlLFxuICAgIG5hdGl2ZVJlZHVjZVJpZ2h0ICA9IEFycmF5UHJvdG8ucmVkdWNlUmlnaHQsXG4gICAgbmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG4gICAgbmF0aXZlRXZlcnkgICAgICAgID0gQXJyYXlQcm90by5ldmVyeSxcbiAgICBuYXRpdmVTb21lICAgICAgICAgPSBBcnJheVByb3RvLnNvbWUsXG4gICAgbmF0aXZlSW5kZXhPZiAgICAgID0gQXJyYXlQcm90by5pbmRleE9mLFxuICAgIG5hdGl2ZUxhc3RJbmRleE9mICA9IEFycmF5UHJvdG8ubGFzdEluZGV4T2YsXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZDtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyIFwiYWR2YW5jZWRcIiBtb2RlLlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjUuMSc7XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyBvYmplY3RzIHdpdGggdGhlIGJ1aWx0LWluIGBmb3JFYWNoYCwgYXJyYXlzLCBhbmQgcmF3IG9iamVjdHMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmb3JFYWNoYCBpZiBhdmFpbGFibGUuXG4gIHZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChfLmhhcyhvYmosIGtleSkpIHtcbiAgICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5XSwga2V5LCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRvciB0byBlYWNoIGVsZW1lbnQuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBtYXBgIGlmIGF2YWlsYWJsZS5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVNYXAgJiYgb2JqLm1hcCA9PT0gbmF0aXZlTWFwKSByZXR1cm4gb2JqLm1hcChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmVzdWx0cy5wdXNoKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgdmFyIHJlZHVjZUVycm9yID0gJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnO1xuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZWAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZSAmJiBvYmoucmVkdWNlID09PSBuYXRpdmVSZWR1Y2UpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZShpdGVyYXRvcik7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gdmFsdWU7XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlUmlnaHRgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2VSaWdodCAmJiBvYmoucmVkdWNlUmlnaHQgPT09IG5hdGl2ZVJlZHVjZVJpZ2h0KSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCAhPT0gK2xlbmd0aCkge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpbmRleCA9IGtleXMgPyBrZXlzWy0tbGVuZ3RoXSA6IC0tbGVuZ3RoO1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSBvYmpbaW5kZXhdO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIG9ialtpbmRleF0sIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlRmlsdGVyICYmIG9iai5maWx0ZXIgPT09IG5hdGl2ZUZpbHRlcikgcmV0dXJuIG9iai5maWx0ZXIoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4gIWl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9LCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGV2ZXJ5YCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZUV2ZXJ5ICYmIG9iai5ldmVyeSA9PT0gbmF0aXZlRXZlcnkpIHJldHVybiBvYmouZXZlcnkoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBzb21lYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIHZhciBhbnkgPSBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVTb21lICYmIG9iai5zb21lID09PSBuYXRpdmVTb21lKSByZXR1cm4gb2JqLnNvbWUoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChyZXN1bHQgfHwgKHJlc3VsdCA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gdmFsdWVba2V5XTsgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycywgZmlyc3QpIHtcbiAgICBpZiAoXy5pc0VtcHR5KGF0dHJzKSkgcmV0dXJuIGZpcnN0ID8gdm9pZCAwIDogW107XG4gICAgcmV0dXJuIF9bZmlyc3QgPyAnZmluZCcgOiAnZmlsdGVyJ10ob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG4gICAgICAgIGlmIChhdHRyc1trZXldICE9PSB2YWx1ZVtrZXldKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLndoZXJlKG9iaiwgYXR0cnMsIHRydWUpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IG9yIChlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgLy8gQ2FuJ3Qgb3B0aW1pemUgYXJyYXlzIG9mIGludGVnZXJzIGxvbmdlciB0aGFuIDY1LDUzNSBlbGVtZW50cy5cbiAgLy8gU2VlIFtXZWJLaXQgQnVnIDgwNzk3XShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9ODA3OTcpXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0VtcHR5KG9iaikpIHJldHVybiAtSW5maW5pdHk7XG4gICAgdmFyIHJlc3VsdCA9IHtjb21wdXRlZCA6IC1JbmZpbml0eSwgdmFsdWU6IC1JbmZpbml0eX07XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGNvbXB1dGVkID4gcmVzdWx0LmNvbXB1dGVkICYmIChyZXN1bHQgPSB7dmFsdWUgOiB2YWx1ZSwgY29tcHV0ZWQgOiBjb21wdXRlZH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopICYmIG9ialswXSA9PT0gK29ialswXSAmJiBvYmoubGVuZ3RoIDwgNjU1MzUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShNYXRoLCBvYmopO1xuICAgIH1cbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNFbXB0eShvYmopKSByZXR1cm4gSW5maW5pdHk7XG4gICAgdmFyIHJlc3VsdCA9IHtjb21wdXRlZCA6IEluZmluaXR5LCB2YWx1ZTogSW5maW5pdHl9O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBjb21wdXRlZCA8IHJlc3VsdC5jb21wdXRlZCAmJiAocmVzdWx0ID0ge3ZhbHVlIDogdmFsdWUsIGNvbXB1dGVkIDogY29tcHV0ZWR9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYW4gYXJyYXkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByYW5kO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNodWZmbGVkID0gW107XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oaW5kZXgrKyk7XG4gICAgICBzaHVmZmxlZFtpbmRleCAtIDFdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBsb29rdXAgaXRlcmF0b3JzLlxuICB2YXIgbG9va3VwSXRlcmF0b3IgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUgOiBmdW5jdGlvbihvYmopeyByZXR1cm4gb2JqW3ZhbHVlXTsgfTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0b3IuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCkge1xuICAgIHZhciBpdGVyYXRvciA9IGxvb2t1cEl0ZXJhdG9yKHZhbHVlKTtcbiAgICByZXR1cm4gXy5wbHVjayhfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWUgOiB2YWx1ZSxcbiAgICAgICAgaW5kZXggOiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWEgOiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCA8IHJpZ2h0LmluZGV4ID8gLTEgOiAxO1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQsIGJlaGF2aW9yKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBpdGVyYXRvciA9IGxvb2t1cEl0ZXJhdG9yKHZhbHVlID09IG51bGwgPyBfLmlkZW50aXR5IDogdmFsdWUpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIHZhciBrZXkgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgIGJlaGF2aW9yKHJlc3VsdCwga2V5LCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBHcm91cHMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbi4gUGFzcyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlXG4gIC8vIHRvIGdyb3VwIGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3JpdGVyaW9uLlxuICBfLmdyb3VwQnkgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGdyb3VwKG9iaiwgdmFsdWUsIGNvbnRleHQsIGZ1bmN0aW9uKHJlc3VsdCwga2V5LCB2YWx1ZSkge1xuICAgICAgKF8uaGFzKHJlc3VsdCwga2V5KSA/IHJlc3VsdFtrZXldIDogKHJlc3VsdFtrZXldID0gW10pKS5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBncm91cChvYmosIHZhbHVlLCBjb250ZXh0LCBmdW5jdGlvbihyZXN1bHQsIGtleSkge1xuICAgICAgaWYgKCFfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldID0gMDtcbiAgICAgIHJlc3VsdFtrZXldKys7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yID0gaXRlcmF0b3IgPT0gbnVsbCA/IF8uaWRlbnRpdHkgOiBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+PiAxO1xuICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVttaWRdKSA8IHZhbHVlID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICByZXR1cm4gKG4gIT0gbnVsbCkgJiYgIWd1YXJkID8gc2xpY2UuY2FsbChhcnJheSwgMCwgbikgOiBhcnJheVswXTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoXG4gIC8vIGBfLm1hcGAuXG4gIF8uaW5pdGlhbCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBhcnJheS5sZW5ndGggLSAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQgPyAxIDogbikpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmICgobiAhPSBudWxsKSAmJiAhZ3VhcmQpIHtcbiAgICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBNYXRoLm1heChhcnJheS5sZW5ndGggLSBuLCAwKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKipcbiAgLy8gY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgKG4gPT0gbnVsbCkgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBvdXRwdXQpIHtcbiAgICBpZiAoc2hhbGxvdyAmJiBfLmV2ZXJ5KGlucHV0LCBfLmlzQXJyYXkpKSB7XG4gICAgICByZXR1cm4gY29uY2F0LmFwcGx5KG91dHB1dCwgaW5wdXQpO1xuICAgIH1cbiAgICBlYWNoKGlucHV0LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkgfHwgXy5pc0FyZ3VtZW50cyh2YWx1ZSkpIHtcbiAgICAgICAgc2hhbGxvdyA/IHB1c2guYXBwbHkob3V0cHV0LCB2YWx1ZSkgOiBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBvdXRwdXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29tcGxldGVseSBmbGF0dGVuZWQgdmVyc2lvbiBvZiBhbiBhcnJheS5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgW10pO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdG9yO1xuICAgICAgaXRlcmF0b3IgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIHZhciBpbml0aWFsID0gaXRlcmF0b3IgPyBfLm1hcChhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIDogYXJyYXk7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGVhY2goaW5pdGlhbCwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICBpZiAoaXNTb3J0ZWQgPyAoIWluZGV4IHx8IHNlZW5bc2Vlbi5sZW5ndGggLSAxXSAhPT0gdmFsdWUpIDogIV8uY29udGFpbnMoc2VlbiwgdmFsdWUpKSB7XG4gICAgICAgIHNlZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgIHJlc3VsdHMucHVzaChhcnJheVtpbmRleF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuaXEoXy5mbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBfLmZpbHRlcihfLnVuaXEoYXJyYXkpLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gXy5ldmVyeShyZXN0LCBmdW5jdGlvbihvdGhlcikge1xuICAgICAgICByZXR1cm4gXy5pbmRleE9mKG90aGVyLCBpdGVtKSA+PSAwO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7IHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7IH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IF8ubWF4KF8ucGx1Y2soYXJndW1lbnRzLCBcImxlbmd0aFwiKS5jb25jYXQoMCkpO1xuICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0c1tpXSA9IF8ucGx1Y2soYXJndW1lbnRzLCAnJyArIGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgaWYgKGxpc3QgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwbHkgdXMgd2l0aCBpbmRleE9mIChJJ20gbG9va2luZyBhdCB5b3UsICoqTVNJRSoqKSxcbiAgLy8gd2UgbmVlZCB0aGlzIGZ1bmN0aW9uLiBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuXG4gIC8vIGl0ZW0gaW4gYW4gYXJyYXksIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBpbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgICAgaSA9IChpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGxhc3RJbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIF8ubGFzdEluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgZnJvbSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGhhc0luZGV4ID0gZnJvbSAhPSBudWxsO1xuICAgIGlmIChuYXRpdmVMYXN0SW5kZXhPZiAmJiBhcnJheS5sYXN0SW5kZXhPZiA9PT0gbmF0aXZlTGFzdEluZGV4T2YpIHtcbiAgICAgIHJldHVybiBoYXNJbmRleCA/IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0sIGZyb20pIDogYXJyYXkubGFzdEluZGV4T2YoaXRlbSk7XG4gICAgfVxuICAgIHZhciBpID0gKGhhc0luZGV4ID8gZnJvbSA6IGFycmF5Lmxlbmd0aCk7XG4gICAgd2hpbGUgKGktLSkgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IGFyZ3VtZW50c1syXSB8fCAxO1xuXG4gICAgdmFyIGxlbiA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQXJyYXkobGVuKTtcblxuICAgIHdoaWxlKGlkeCA8IGxlbikge1xuICAgICAgcmFuZ2VbaWR4KytdID0gc3RhcnQ7XG4gICAgICBzdGFydCArPSBzdGVwO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldXNhYmxlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciBwcm90b3R5cGUgc2V0dGluZy5cbiAgdmFyIGN0b3IgPSBmdW5jdGlvbigpe307XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgdmFyIGFyZ3MsIGJvdW5kO1xuICAgIGlmIChuYXRpdmVCaW5kICYmIGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihmdW5jKSkgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSkgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IGZ1bmMucHJvdG90eXBlO1xuICAgICAgdmFyIHNlbGYgPSBuZXcgY3RvcjtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHNlbGYsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHJldHVybiByZXN1bHQ7XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEJpbmQgYWxsIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdFxuICAvLyBhbGwgY2FsbGJhY2tzIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcihcImJpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXNcIik7XG4gICAgZWFjaChmdW5jcywgZnVuY3Rpb24oZikgeyBvYmpbZl0gPSBfLmJpbmQob2JqW2ZdLCBvYmopOyB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vID0ge307XG4gICAgaGFzaGVyIHx8IChoYXNoZXIgPSBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5ID0gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gXy5oYXMobWVtbywga2V5KSA/IG1lbW9ba2V5XSA6IChtZW1vW2tleV0gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7IH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiBfLmRlbGF5LmFwcGx5KF8sIFtmdW5jLCAxXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBuZXcgRGF0ZTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9O1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbiAgLy8gb2Z0ZW4geW91IGNhbGwgaXQuIFVzZWZ1bCBmb3IgbGF6eSBpbml0aWFsaXphdGlvbi5cbiAgXy5vbmNlID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciByYW4gPSBmYWxzZSwgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocmFuKSByZXR1cm4gbWVtbztcbiAgICAgIHJhbiA9IHRydWU7XG4gICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IFtmdW5jXTtcbiAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiB3cmFwcGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZ1bmNzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgZm9yICh2YXIgaSA9IGZ1bmNzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGFyZ3MgPSBbZnVuY3NbaV0uYXBwbHkodGhpcywgYXJncyldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYWZ0ZXIgYmVpbmcgY2FsbGVkIE4gdGltZXMuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gbmF0aXZlS2V5cyB8fCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqICE9PSBPYmplY3Qob2JqKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBvYmplY3QnKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgdmFsdWVzLnB1c2gob2JqW2tleV0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcGFpcnMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBwYWlycy5wdXNoKFtrZXksIG9ialtrZXldXSk7XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmVzdWx0W29ialtrZXldXSA9IGtleTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBlYWNoKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGtleSBpbiBvYmopIGNvcHlba2V5XSA9IG9ialtrZXldO1xuICAgIH0pO1xuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmICghXy5jb250YWlucyhrZXlzLCBrZXkpKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGNvcHk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSB2b2lkIDApIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuIGEgPT0gU3RyaW5nKGIpO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS4gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvclxuICAgICAgICAvLyBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuIGEgIT0gK2EgPyBiICE9ICtiIDogKGEgPT0gMCA/IDEgLyBhID09IDEgLyBiIDogYSA9PSArYik7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb21wYXJlZCBieSB0aGVpciBzb3VyY2UgcGF0dGVybnMgYW5kIGZsYWdzLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgICAgcmV0dXJuIGEuc291cmNlID09IGIuc291cmNlICYmXG4gICAgICAgICAgICAgICBhLmdsb2JhbCA9PSBiLmdsb2JhbCAmJlxuICAgICAgICAgICAgICAgYS5tdWx0aWxpbmUgPT0gYi5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgICAgIGEuaWdub3JlQ2FzZSA9PSBiLmlnbm9yZUNhc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PSBiO1xuICAgIH1cbiAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiAoYUN0b3IgaW5zdGFuY2VvZiBhQ3RvcikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiAoYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcikpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcbiAgICB2YXIgc2l6ZSA9IDAsIHJlc3VsdCA9IHRydWU7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGNsYXNzTmFtZSA9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIHNpemUgPSBhLmxlbmd0aDtcbiAgICAgIHJlc3VsdCA9IHNpemUgPT0gYi5sZW5ndGg7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBlcShhW3NpemVdLCBiW3NpemVdLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIGZvciAodmFyIGtleSBpbiBhKSB7XG4gICAgICAgIGlmIChfLmhhcyhhLCBrZXkpKSB7XG4gICAgICAgICAgLy8gQ291bnQgdGhlIGV4cGVjdGVkIG51bWJlciBvZiBwcm9wZXJ0aWVzLlxuICAgICAgICAgIHNpemUrKztcbiAgICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXIuXG4gICAgICAgICAgaWYgKCEocmVzdWx0ID0gXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzLlxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBmb3IgKGtleSBpbiBiKSB7XG4gICAgICAgICAgaWYgKF8uaGFzKGIsIGtleSkgJiYgIShzaXplLS0pKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSAhc2l6ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIsIFtdLCBbXSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBvYmplY3Q/XG4gIF8uaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cC5cbiAgZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBfWydpcycgKyBuYW1lXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFKSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gISEob2JqICYmIF8uaGFzKG9iaiwgJ2NhbGxlZScpKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLlxuICBpZiAodHlwZW9mICgvLi8pICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiBvYmplY3QgYSBmaW5pdGUgbnVtYmVyP1xuICBfLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH07XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gPyAoTmFOIGlzIHRoZSBvbmx5IG51bWJlciB3aGljaCBkb2VzIG5vdCBlcXVhbCBpdHNlbGYpLlxuICBfLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRvcnMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkoTWF0aC5tYXgoMCwgbikpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgZXNjYXBlOiB7XG4gICAgICAnJic6ICcmYW1wOycsXG4gICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICc+JzogJyZndDsnLFxuICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICBcIidcIjogJyYjeDI3OycsXG4gICAgICAnLyc6ICcmI3gyRjsnXG4gICAgfVxuICB9O1xuICBlbnRpdHlNYXAudW5lc2NhcGUgPSBfLmludmVydChlbnRpdHlNYXAuZXNjYXBlKTtcblxuICAvLyBSZWdleGVzIGNvbnRhaW5pbmcgdGhlIGtleXMgYW5kIHZhbHVlcyBsaXN0ZWQgaW1tZWRpYXRlbHkgYWJvdmUuXG4gIHZhciBlbnRpdHlSZWdleGVzID0ge1xuICAgIGVzY2FwZTogICBuZXcgUmVnRXhwKCdbJyArIF8ua2V5cyhlbnRpdHlNYXAuZXNjYXBlKS5qb2luKCcnKSArICddJywgJ2cnKSxcbiAgICB1bmVzY2FwZTogbmV3IFJlZ0V4cCgnKCcgKyBfLmtleXMoZW50aXR5TWFwLnVuZXNjYXBlKS5qb2luKCd8JykgKyAnKScsICdnJylcbiAgfTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIF8uZWFjaChbJ2VzY2FwZScsICd1bmVzY2FwZSddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBfW21ldGhvZF0gPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIGlmIChzdHJpbmcgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuICgnJyArIHN0cmluZykucmVwbGFjZShlbnRpdHlSZWdleGVzW21ldGhvZF0sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHlNYXBbbWV0aG9kXVttYXRjaF07XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdCc6ICAgICAndCcsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdHxcXHUyMDI4fFxcdTIwMjkvZztcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgZGF0YSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgcmVuZGVyO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpXG4gICAgICAgIC5yZXBsYWNlKGVzY2FwZXIsIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTsgfSk7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyBcInJldHVybiBfX3A7XFxuXCI7XG5cbiAgICB0cnkge1xuICAgICAgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSByZXR1cm4gcmVuZGVyKGRhdGEsIF8pO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgZnVuY3Rpb24gc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonKSArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGRlbGVnYXRlIHRvIHRoZSB3cmFwcGVyLlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8ob2JqKS5jaGFpbigpO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PSAnc2hpZnQnIHx8IG5hbWUgPT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICBfLmV4dGVuZChfLnByb3RvdHlwZSwge1xuXG4gICAgLy8gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICAgIGNoYWluOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NoYWluID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgICB9XG5cbiAgfSk7XG5cbn0pLmNhbGwodGhpcyk7XG4iXX0=
;